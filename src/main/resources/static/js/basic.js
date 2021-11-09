let targetId;

$(document).ready(function () {
    // id 가 query 인 녀석 위에서 엔터를 누르면 execSearch() 함수를 실행하라는 뜻입니다.
    $('#query').on('keypress', function (e) {
        if (e.key === 'Enter') {
            execSearch();
        }
    });

    $('#close').on('click', function () {
        $('#container').removeClass('active');
    })

    $('.nav div.nav-see').on('click', function () {
        $('div.nav-see').addClass('active');
        $('div.nav-search').removeClass('active');

        $('#see-area').show();
        $('#search-area').hide();
    })
    $('.nav div.nav-search').on('click', function () {
        $('div.nav-see').removeClass('active');
        $('div.nav-search').addClass('active');

        $('#see-area').hide();
        $('#search-area').show();
    })

    $('#see-area').show();
    $('#search-area').hide();

    showProduct();
})


function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function execSearch() {
    // 1. 검색창의 입력값을 가져온다.
    let searchInput = $('#query')
    let query = searchInput.val();
    // 2. 검색창 입력값을 검사하고, 입력하지 않았을 경우 focus.
    if (!query) {
        alert("검색어를 입력하세요.");
        searchInput.focus();
        return;
    }
    $.ajax({
        // 3. GET /api/search?query=${query} 요청
        type: "GET",
        url: `/api/search?query=${query}`,
        success: function (response) {
            let resultBox = $('#search-result-box')
            resultBox.empty();
            response.forEach((itemDto) => {
                // 4. for 문마다 itemDto 를 꺼내서 HTML 만들고 검색결과 목록에 붙이기!
                let tempHtml = addHTML(itemDto);
                resultBox.append(tempHtml);
                searchInput.val("");
            })
        }
    })
}

function addHTML(itemDto) {
    const { title, image, lowPrice } = itemDto;
    return `<div class="search-itemDto">
            <div class="search-itemDto-left">
                <img src="${image}" alt="item-image">
            </div>
            <div class="search-itemDto-center">
                <div>${title}</div>
                <div class="price">
                    ${numberWithCommas(lowPrice)}
                    <span class="unit">원</span>
                </div>
            </div>
            <div class="search-itemDto-right">
                <img src="images/icon-save.png" alt="" onclick='addProduct(${JSON.stringify(itemDto)})'>
            </div>
        </div>`;
}

function addProduct(itemDto) {
    $.ajax({
        // 1. POST /api/products 에 관심 상품 생성 요청
        type: "POST",
        url: "/api/products",
        contentType: "application/json",
        data: JSON.stringify(itemDto),
        success: function (response) {
            // 2. 응답 함수에서 modal 을 뜨게 하고, targetId 를 response.id 로 설정
            $('#container').addClass('active');
            targetId = response.id;
        }
    })
}

function showProduct() {
    $.ajax({  // 1. GET /api/products 요청
        type: "GET",
        url: "/api/products",
        success: function (response) {
            // 2. 관심상품 목록, 검색결과 목록 비우기
            let productContainer = $('#product-container')
            productContainer.empty();
            $("#search-result-box").empty();
            response.forEach((product) => {
                // 3. for 문마다 관심 상품 HTML 만들어서 관심상품 목록에 붙이기!
                let tempHtml = addProductItem(product);
                productContainer.append(tempHtml);
            })
        }
    })
}

function addProductItem(product) {
    // link, image, title, lowPrice, myPrice 변수 활용하기
    const { title, image, link, lowPrice, myPrice } = product;
    return `<div class="product-card" onclick="window.location.href='${link}'">
            <div class="card-header">
                <img src="${image}"
                     alt="${title}">
            </div>
            <div class="card-body">
                <div class="title">
                    ${title}
                </div>
                <div class="lprice">
                    <span>${numberWithCommas(lowPrice)}</span>원
                </div>
                <div class="isgood ${lowPrice < myPrice ? "" : "none"}">
                    최저가
                </div>
            </div>
        </div>`;
}

function setMyPrice() {
    // 1. id가 myprice 인 input 태그에서 값을 가져온다.
    let myPrice = $('#myprice');
    // 2. 만약 값을 입력하지 않았으면 alert 를 띄우고 중단한다.
    if (!myPrice.val()) {
        alert("원하는 최저가를 입력해주세요. (닫기를 누르면 최저가 기능 해제)");
        myPrice.focus();
        return;
    }
    $.ajax({
        // 3. PUT /api/product/${targetId} 에 data 를 전달한다.
        type: "PUT",
        url: `/api/products/${targetId}`,
        contentType: "application/json",
        data: JSON.stringify({myprice: myprice}),
        success: function () {
            // 4. 모달을 종료한다. $('#container').removeClass('active');
            $('#container').removeClass('active');
            // 5, 성공적으로 등록되었음을 알리는 alert 를 띄운다.
            alert("희망 가격 설정이 완료되었습니다 ._.");
            // 6. 창을 새로고침한다. window.location.reload();
            window.location.reload();
            targetId = "";
            console.log(response);
        }
    })
}