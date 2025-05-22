let rowid = "";

//에프터 확인

function afterok() {
  aftersubmitData("yes", "");

  let rightBox = jQuery_bs(".rightBox");
  rightBox.html(`
      <div class="resultBox">
          <div class="titleBox">
            <span class="emoji">🔵</span>
            <p class="title">
           사운드판다의 A/S 접수에 만족해주셔서 감사합니다 :)</br>
			더 나은 서비스로 보답하겠습니다.
            </p>
          </div>
		</div>
		`);
}

function afternotok() {
  let afterbox = jQuery_bs(".afterbox");

  if (afterbox.css("display") == "none") {
    afterbox.css("display", "block");

    let notoksend = jQuery_bs("#notoksend");
    notoksend.css("display", "block");

    jQuery_bs("#ok").css("display", "none");
    jQuery_bs("#notok").css("display", "none");
  }
}

function notoksend() {
  let wirtebox = jQuery_bs("#notokwrite").val();

  if (wirtebox == "") {
    alert("내용이 없습니다.");
  } else {
    aftersubmitData("no", jQuery_bs("#notokwrite").val());

    let rightBox = jQuery_bs(".rightBox");
    rightBox.html(`
      <div class="resultBox">
          <div class="titleBox">
            <span class="emoji">🔵</span>
            <p class="title">
           의견을 남겨주셔서 감사합니다 :)</br>
			더 나은 서비스로 보답하겠습니다.
            </p>
          </div>
		</div>
		`);
  }
}

//데이터 전송

function aftersubmitData(type, text) {
  let formData = new FormData();

  formData.append("type", type);
  formData.append("rowid", rowid);
  if (type == "no") {
    formData.append("noText", text);
  }

  // 로딩 이미지 생성
  loadingImg();

  // ajax를 통한 서버로 data 전송
  jQuery_bs.ajax({
    type: "POST",
    url: "https://lifezip.co.kr:8443/soundpanda/API?inquiry=aftercareplus",
    enctype: "multipart/form-data",
    data: formData,
    cache: false,
    contentType: false,
    processData: false,
    error: function (xhr, status, errorThrown) {
      alert("죄송합니다. 다시 한 번 확인해주세요. :(");
      // 뒤로가기 캐치
      backHistory();
    },
    success: function (data) {
      // 뒤로가기 캐치
      backHistory();
    },
  });
}

// 시작
jQuery_bs(document).ready(function () {
  // 초기 설정
  let sheetForm = jQuery_bs("#sheetForm");

  jQuery_bs("head").find("title").text("판다 케어 플러스 - 사운드판다");

  if (jQuery_bs("body").find(sheetForm)) {
    jQuery_bs("#contents").addClass("on");
  }

  // input (이름칸, 번호칸 정규표현식 일치)
  wordMatch();

  // 셀렉트 옵션 실행
  selectOption();

  // 기타 구매처 선택시 창 생성
  etcStore();

  // 전송 버튼
  startData();
});

// 기타 구매처 선택시 창 생성
function etcStore() {
  let inputBox3 = jQuery_bs(".inputBox:nth-child(3)");
  var inputBox = document.querySelector(".inputBoxFile");

  jQuery_bs("#store").change(function () {
    jQuery_bs("#store option:selected").each(function () {
      if (jQuery_bs(this).val() == "기타 구매처") {
        inputBox.style.display = "block";
        inputBox3.removeClass("off");
      } else if (jQuery_bs(this).val() == "쿠팡_로켓배송") {
        inputBox.style.display = "block";
        inputBox3.addClass("off");
        jQuery_bs("#etcStore").val("");
      } else {
        inputBox.style.display = "none";
        inputBox3.addClass("off");
        jQuery_bs("#etcStore").val("");
      }
    });
  });
}

// input (이름칸, 번호칸 정규표현식 일치)
function wordMatch() {
  jQuery_bs("#name").blur(function () {
    let reqWord = /^[가-힣a-zA-Z]+$/;
    let nameVal = jQuery_bs(this).val();
    if (nameVal.length > 0) {
      if (!nameVal.match(reqWord)) {
        alert("이름은 한글, 영문으로 입력해주시기 바랍니다.");
        jQuery_bs(this).val("");
        jQuery_bs(this).focus();
        return;
      }
    }
  });

  jQuery_bs("#phone").blur(function () {
    let reqNum = /^[0-9]*$/;
    let numVal = jQuery_bs(this).val();
    if (numVal.length > 0) {
      if (!numVal.match(reqNum)) {
        alert("전화번호는 숫자만 입력해주시기 바랍니다.");
        jQuery_bs(this).val("");
        jQuery_bs(this).focus();
        return;
      }
    }
  });
}

// 셀렉트 옵션 만들기
function createOption(tCode) {
  let sheetName = `https://lifezip.co.kr:8443/soundpanda/API?tcode=${tCode}`;

  jQuery_bs.get(sheetName, function (json) {
    let shName = json;
    shName.reverse();

    let store = jQuery_bs("#store"),
      model = jQuery_bs("#model");

    let firstOption = document.createElement("option");
    firstOption.setAttribute("value", "");
    firstOption.innerText = "해당 옵션을 선택해주세요.";

    if (tCode == "store") {
      let basicOption = document.createElement("option");
      basicOption.setAttribute("value", "기타 구매처");
      basicOption.innerText = "기타 구매처";
      store.append(firstOption, basicOption);

      for (j = 0; j < shName.length; j++) {
        let selectOption = document.createElement("option");
        selectOption.setAttribute("value", `${shName[j]}`);
        selectOption.innerText = `${shName[j]}`;

        firstOption.after(selectOption);
      }
    } else if (tCode == "model3") {
      model.append(firstOption);
      for (j = 0; j < shName.length; j++) {
        let selectOption = document.createElement("option");
        selectOption.setAttribute("value", shName[j].model);
        selectOption.innerText = shName[j].model;

        firstOption.after(selectOption);
      }
    }
  });
}

// 셀렉트 넣기
function selectOption() {
  let select = jQuery_bs(".select"),
    sel = "";

  for (i = 0; i < select.length; i++) {
    let selectId = select[i].getAttribute("id");

    if (selectId == "store") {
      sel = "store";
      createOption(sel);
    } else if (selectId == "model") {
      sel = "model3";
      createOption(sel);
    }
  }
}

// 주소 찾기 (공통레이아웃 - 다음 주소 찾기 API)
function getPostCode() {
  new daum.Postcode({
    oncomplete: function (data) {
      // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

      // 각 주소의 노출 규칙에 따라 주소를 조합한다.
      // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
      let addr = "",
        extraAddr = "";

      // 사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
      if (data.userSelectedType === "R") {
        // 사용자가 도로명 주소를 선택했을 경우
        addr = data.roadAddress;
      } else {
        // 사용자가 지번 주소를 선택했을 경우(J)
        addr = data.jibunAddress;
      }

      // 사용자가 선택한 주소가 도로명 타입일때 참고항목을 조합한다.
      if (data.userSelectedType === "R") {
        // 법정동명이 있을 경우 추가한다. (법정리는 제외)
        // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
        if (data.bname !== "" && /[동|로|가]$/g.test(data.bname)) {
          extraAddr += data.bname;
        }
        // 건물명이 있고, 공동주택일 경우 추가한다.
        if (data.buildingName !== "" && data.apartment === "Y") {
          extraAddr +=
            extraAddr !== "" ? ", " + data.buildingName : data.buildingName;
        }
        // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
        if (extraAddr !== "") {
          extraAddr = "(" + extraAddr + ")";
        }
        // 조합된 참고항목을 해당 필드에 넣는다.
        document.getElementById("extraAddress").value = extraAddr;
      } else {
        document.getElementById("extraAddress").value = "";
      }

      // 우편번호와 주소 정보를 해당 필드에 넣는다.
      document.getElementById("postCode").value = data.zonecode;
      document.getElementById("address").value = addr;
      // 커서를 상세주소 필드로 이동한다.
      document.getElementById("detailAddress").focus();
    },
  }).open();
}

// 판다케어플러스 접수 데이터 전송 버튼 클릭
function startData() {
  let submitBtn = jQuery_bs("#submitBtn");

  submitBtn.removeAttr("disabled");

  submitBtn.click(function () {
    // 접수데이터 전송
    submitData();
  });
}

// 로딩이미지 생성
function loadingImg() {
  let loadingHtml = `
  <div id="loading">
    <div class="loading_box">
      <img src="/icon/loadingImg.gif"/>
    </div>
  </div>`;

  jQuery_bs(".rightBox").html(loadingHtml);
}

// 뒤로가기 캐치 (테스트페이지 http://skin-skin38.pandaint7.cafe24.com/)
function backHistory() {
  history.pushState(null, null, "");

  window.onpopstate = function (e) {
    let prevUrl = document.referrer.split(".com")[1],
      curUrl = document.location.href.split(".com")[1];

    if (curUrl !== "/sheetform/careplus.html") {
      location.href = "/index.html";
    } else {
      location.replace(location.href);
    }
  };
}

// 판다케어 접수 데이터 전송
function submitData() {
  let caldate = jQuery_bs("#caldate"),
    selectStore = jQuery_bs("#store"),
    storeOption = jQuery_bs("#store option:selected").val(),
    etcStore = jQuery_bs("#etcStore"),
    selectModel = jQuery_bs("#model"),
    modelOption = jQuery_bs("#model option:selected").val(),
    userName = jQuery_bs("#name"),
    userPhone = jQuery_bs("#phone"),
    qnaWrite = jQuery_bs("#qnawrite"),
    postCode = jQuery_bs("#postCode"),
    address = jQuery_bs("#address"),
    addressBtn = jQuery_bs("#addressBtn"),
    detailAddress = jQuery_bs("#detailAddress"),
    extraAddress = jQuery_bs("#extraAddress"),
    shipCheck = jQuery_bs(".shipCheck"),
    shipCheckVal = jQuery_bs(".shipCheck:checked").val(),
    agreeCheck = jQuery_bs(".agreeCheck"),
    agreeCheckVal = jQuery_bs(".agreeCheck:checked").val();

  // 요구사항 입력 체크
  if (caldate.val() == "") {
    alert("구매일을 입력해주세요.");
    caldate.focus();
    return;
  } else if (storeOption == "") {
    alert("구매처를 선택해주세요.");
    selectStore.focus();
    return;
  } else if (modelOption == "") {
    alert("모델명을 선택해주세요.");
    selectModel.focus();
    return;
  } else if (userName.val() == "") {
    alert("이름를 입력해주세요");
    userName.focus();
    return;
  } else if (userPhone.val() == "") {
    alert("핸드폰 번호를 입력해주세요.");
    userPhone.focus();
    return;
  } else if (postCode.val() == "") {
    alert("우편번호 찾기를 눌러 주소를 입력해주세요.");
    addressBtn.focus();
    return;
  } else if (detailAddress.val() == "") {
    alert("상세주소를 입력해주세요.");
    detailAddress.focus();
    return;
  } else if (qnaWrite.val() == "") {
    alert("서비스 접수 내용(고장 부분)을 입력해주세요.");
    qnaWrite.focus();
    return;
  } else if (shipCheckVal == undefined) {
    alert("택배 발송 정보를 확인하셨다면 체크해주세요.");
    shipCheck.focus();
    return;
  }

  let myForm = jQuery_bs("#form")[0];
  let formData = new FormData();

  formData.append("cpDate", caldate.val());
  formData.append("cpStore", storeOption);
  formData.append("cpModel", modelOption);
  formData.append("cpName", userName.val());
  formData.append("cpPhone", userPhone.val());
  formData.append(
    "cpaddress",
    `(${postCode.val()}) ${address.val()} ${detailAddress.val()} ${extraAddress.val()}`
  );
  formData.append("cpWrite", qnaWrite.val());
  formData.append("cpShipCheck", shipCheckVal);
  formData.append("cpAgreeCheck", agreeCheckVal);

  if (storeOption == "기타 구매처") {
    if (etcStore.val() == "") {
      alert("기타 구매처를 입력해주세요.");
      etcStore.focus();
      return;
    }

    formData.append("etcStore", etcStore.val());
  }
  var fileInput = document.getElementById("picture");
  if (storeOption == "쿠팡_로켓배송" || storeOption == "기타 구매처") {
    if (fileInput.files.length == 0) {
      alert("파일을 확인해주세요.");
      fileInput.focus();
      return;
    } else if (fileInput.files.length !== 0) {
      var file = fileInput.files[0]; // 여기서는 하나의 파일만 업로드한다고 가정
      // FormData 객체 생성 및 파일 추가
      formData.append("file", file); // "file"은 서버에서 파일을 처리하는데 사용될 키 이름
    }
  }

  // 로딩 이미지 생성
  loadingImg();

  // ajax를 통한 서버로 data 전송
  jQuery_bs.ajax({
    type: "POST",
    url: "https://lifezip.co.kr:8443/soundpanda/API?inquiry=careplus",
    enctype: "multipart/form-data",
    data: formData,
    cache: false,
    contentType: false,
    processData: false,
    error: function (xhr, status, errorThrown) {
      alert("죄송합니다. 다시 한 번 확인해주세요. :(");
      console.log(xhr, status, errorThrown);

      myForm.reset();

      jQuery_bs("html, body").animate(
        {
          scrollTop: 0,
        },
        400
      );

      let rightBox = jQuery_bs(".rightBox");

      rightBox.html(`
        <div class="resultBox">
          <div class="titleBox">
            <span class="emoji">🔴</span>
            <p class="title">
              전송이 실패하였습니다. : ( <br>
              다시 한번 시도해주세요. 🙇‍♀️
            </p>
          </div>
        </div>
      `);

      // 뒤로가기 캐치
      backHistory();
    },
    success: function (data) {
      myForm.reset();

      jQuery_bs("html, body").animate(
        {
          scrollTop: 0,
        },
        400
      );

      let rightBox = jQuery_bs(".rightBox");
      rightBox.html(`
      <div class="resultBox">
          <div class="titleBox">
            <span class="emoji">🔵</span>
            <p class="title">
              전송이 완료되었습니다. :) <br>
              빠른 시일 내 안내드릴께요. 🙋 <br><br>
			사운드판다의 A/S접수 어떠셨나요?
            </p>
          </div>
			<div style="text-align: center;">
                <button id="ok" type="button" onclick="afterok()">
                    <span>좋아요</span>
                </button>

                <button id="notok" type="button" onclick = "afternotok()">
                    <span>아쉬워요</span>
                </button>
			</div>

			<div class="afterbox" style="text-align: center;margin-top: 30px; display: none;">
 			<p class="title">
            아쉽게 느껴진 점을 말씀해 주시면 100% 스타벅스 아메리카노 리워드 당첨!<br>

			AS접수시 남겨 주신 휴대번호로 영업일 2일 내 발송됩니다.<br><br>

            고객님의 말씀은<br>

            사운드판다 서비스 개선에 반영됩니다 :)<br>

            정성스러운 답변 감사합니다.
            </p>
			<textarea id="notokwrite" name="notokwrite" tabindex="0" maxlength="4000" rows="5" class="boxwrite" style="width: 320px; height: 111px;"></textarea>
			</div>
       <div style="display: flex; justify-content: center;">
   		 	<button id="notoksend" type="button" style="display: none;" onclick="notoksend()">
                    <span>전송하기</span>
                </button>
       </div>
        </div>
      `);

      console.log("백희연", data);

      rowid = data;

      // 뒤로가기 캐치
      backHistory();
    },
  });
}
