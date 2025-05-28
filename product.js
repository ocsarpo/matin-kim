// 상품 데이터 로드 및 화면에 표시하는 함수
function loadProducts() {
    // JSON 파일에서 상품 데이터 가져오기
    fetch('./product_list.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('JSON 파일을 불러오는데 실패했습니다');
            }
            return response.json();
        })
        .then(data => {
            renderProducts(data.products);
        })
        .catch(error => {
            console.error('상품 데이터 로드 오류:', error);
        });
}

function jsLoadProducts() {
    // 직접 정의된 데이터를 사용
    renderProducts(productsData.products);
}

// 상품 카드 HTML 생성 함수
function createProductCard(product) {
    const soldOutClass = product.isSoldOut ? 'sold-out' : '';
    const ribbonClass = product.showSoldOutRibbon ? '' : 'ribbon-hide';
    
    return `
        <div class="product-card ${soldOutClass}">
            <div class="product-image-container">
                <span class="sold-out-ribbon ${ribbonClass}">품절임박</span>
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <div class="size-guide-icon">사이즈 가이드</div>
            </div>
            <div class="product-info">
                <h2 class="product-title">${product.name}</h2>
                <div class="product-details">
                    <div class="product-detail">
                        <span>컬러:</span>
                        <span>${product.color}</span>
                    </div>
                    <div class="product-detail">
                        <span>사이즈:</span>
                        <span>${product.size}</span>
                    </div>
                    <div class="product-detail">
                        <span>수량:</span>
                        <span>${product.quantity}</span>
                    </div>
                </div>
                <div class="price-container">
                    <span class="original-price">${product.originalPrice}</span>
                    <span class="discount-price">${product.discountPrice}</span>
                    <div class="shipping-info">
                        <span class="shipping-note">택배비 별도</span>
                        <span class="direct-trade">직거래 가능</span>
                    </div>
                </div>
                <div class="button-container">
                    <a href="${product.detailUrl}" class="product-link" target="_blank">상세</a>
                    <a href="https://open.kakao.com/o/s8Qb36ph" class="kakao-link" target="_blank">카톡문의</a>
                </div>
            </div>
        </div>
    `;
}

// 상품 데이터로 화면 구성하기
function renderProducts(products) {
    const productGrid = document.querySelector('.product-grid');
    productGrid.innerHTML = ''; // 기존 내용 비우기
    
    // ordering 기준으로 오름차순 정렬
    const sortedProducts = [...products].sort((a, b) => a.ordering - b.ordering);
    
    sortedProducts.forEach(product => {
        productGrid.innerHTML += createProductCard(product);
    });
    
    // 이벤트 다시 바인딩
    initializeEventListeners();
}

// 이벤트 리스너 초기화
function initializeEventListeners() {
    // 모달 관련 요소들
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalPriceContainer = document.getElementById('modalPriceContainer');
    const modalButtons = document.getElementById('modalButtons');
    const closeBtn = document.getElementsByClassName('close')[0];
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    // 현재 표시 중인 상품 인덱스
    let currentProductIndex = 0;
    const allProductCards = document.querySelectorAll('.product-card');
    
    // 상품 이미지 클릭 이벤트
    document.querySelectorAll('.product-image-container').forEach((container, index) => {
        container.addEventListener('click', function(event) {
            // 사이즈 가이드 클릭 시 이벤트 버블링 방지
            if (event.target.classList.contains('size-guide-icon')) {
                return;
            }
            
            // 품절 상품인 경우 모달을 열지 않음
            const productCard = this.closest('.product-card');
            if (productCard.classList.contains('sold-out')) {
                return;
            }
            
            // 현재 상품 인덱스 설정
            currentProductIndex = index;
            
            // 모달에 상품 정보 표시
            displayProductInModal(productCard);
        });
    });
    
    // 모달에 상품 정보 표시하는 함수
    function displayProductInModal(productCard, isSwipe = false) {
        const img = productCard.querySelector('.product-image');
        const title = productCard.querySelector('.product-title').textContent;
        const priceContainer = productCard.querySelector('.price-container').cloneNode(true);
        const buttonContainer = productCard.querySelector('.button-container').cloneNode(true);
        
        if (!isSwipe) {
            modal.style.display = "block";
            // 모달이 열릴 때 스크롤 막기
            document.body.style.overflow = 'hidden';
        }
        
        // 이미지와 모달 정보 업데이트
        modalImg.src = img.src;
        modalTitle.textContent = title;
        modalPriceContainer.innerHTML = '';
        
        // 모달 가격 컨테이너에 요소 추가 시 price-items div로 감싸기
        const priceItems = document.createElement('div');
        priceItems.className = 'price-items';
        
        const originalPrice = priceContainer.querySelector('.original-price');
        const discountPrice = priceContainer.querySelector('.discount-price');
        
        if (originalPrice) priceItems.appendChild(originalPrice.cloneNode(true));
        if (discountPrice) priceItems.appendChild(discountPrice.cloneNode(true));
        
        modalPriceContainer.appendChild(priceItems);
        
        // 배송 정보 추가
        const shippingInfo = priceContainer.querySelector('.shipping-info');
        if (shippingInfo) modalPriceContainer.appendChild(shippingInfo.cloneNode(true));
        
        modalButtons.innerHTML = '';
        modalButtons.appendChild(buttonContainer);
        
        // 품절 상품 처리
        if (productCard.classList.contains('sold-out')) {
            // 이미지에 품절 스타일 적용
            modalImg.style.filter = 'grayscale(100%)';
            modalImg.style.opacity = '0.6';
            
            // 품절 텍스트 오버레이 생성
            const soldOutOverlay = document.createElement('div');
            soldOutOverlay.style.position = 'absolute';
            soldOutOverlay.style.top = '50%';
            soldOutOverlay.style.left = '50%';
            soldOutOverlay.style.transform = 'translate(-50%, -50%)';
            soldOutOverlay.style.fontSize = '36px';
            soldOutOverlay.style.fontWeight = 'bold';
            soldOutOverlay.style.color = '#ff4757';
            soldOutOverlay.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
            soldOutOverlay.style.padding = '15px 30px';
            soldOutOverlay.style.borderRadius = '5px';
            soldOutOverlay.style.zIndex = '1001';
            soldOutOverlay.textContent = '품절';
            modal.appendChild(soldOutOverlay);
            
            // 버튼 비활성화
            const buttons = modalButtons.querySelectorAll('a');
            buttons.forEach(button => {
                button.style.pointerEvents = 'none';
                button.style.opacity = '0.5';
                button.style.backgroundColor = '#ccc';
                button.style.color = '#666';
            });
        } else {
            // 품절이 아닌 경우 이전 품절 상태 초기화
            modalImg.style.filter = '';
            modalImg.style.opacity = '';
            
            // 이전에 추가된 품절 오버레이 제거
            const existingSoldOutOverlay = modal.querySelector('div[style*="translate(-50%, -50%)"]');
            if (existingSoldOutOverlay) {
                modal.removeChild(existingSoldOutOverlay);
            }
        }
    }
    
    // 다음 상품 표시
    function showNextProduct() {
        let nextIndex = currentProductIndex;
        do {
            if (nextIndex < allProductCards.length - 1) {
                nextIndex++;
            } else {
                nextIndex = 0; // 마지막 상품이면 처음으로 돌아감
            }
            // 모든 상품이 품절인 경우 무한 루프 방지
            if (nextIndex === currentProductIndex) break;
        } while (allProductCards[nextIndex].classList.contains('sold-out'));
        
        // 다음 품절되지 않은 상품을 찾았거나, 모든 상품이 품절인 경우
        currentProductIndex = nextIndex;
        displayProductInModal(allProductCards[currentProductIndex], true);
    }
    
    // 이전 상품 표시
    function showPreviousProduct() {
        let prevIndex = currentProductIndex;
        do {
            if (prevIndex > 0) {
                prevIndex--;
            } else {
                prevIndex = allProductCards.length - 1; // 첫 상품이면 마지막으로 이동
            }
            // 모든 상품이 품절인 경우 무한 루프 방지
            if (prevIndex === currentProductIndex) break;
        } while (allProductCards[prevIndex].classList.contains('sold-out'));
        
        // 이전 품절되지 않은 상품을 찾았거나, 모든 상품이 품절인 경우
        currentProductIndex = prevIndex;
        displayProductInModal(allProductCards[currentProductIndex], true);
    }
    
    // 네비게이션 버튼 이벤트
    prevBtn.addEventListener('click', showPreviousProduct);
    nextBtn.addEventListener('click', showNextProduct);
    
    // 키보드 이벤트
    document.addEventListener('keydown', function(e) {
        if (modal.style.display === "block") {
            if (e.key === "ArrowLeft") {
                showPreviousProduct();
            } else if (e.key === "ArrowRight") {
                showNextProduct();
            } else if (e.key === "Escape") {
                closeModal();
            }
        }
    });
    
    // 모달 닫기
    function closeModal() {
        modal.style.display = "none";
        document.body.style.overflow = '';
    }
    
    // 닫기 버튼 클릭 이벤트
    closeBtn.addEventListener('click', closeModal);
    
    // 모달 영역 클릭 시 닫기
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });
    
    // 사이즈 가이드 버튼 이벤트
    document.querySelectorAll('.size-guide-icon').forEach(button => {
        button.addEventListener('click', function(event) {
            event.stopPropagation();
            
            const productTitle = this.closest('.product-card').querySelector('.product-title').textContent.trim();
            const baseFileName = productTitle.replace(/\s+/g, '_');
            const extensions = ['jpg', 'png', 'jpeg', 'webp'];
            
            modal.style.display = "block";
            modalTitle.textContent = "사이즈 가이드: " + productTitle;
            modalPriceContainer.innerHTML = '';
            modalButtons.innerHTML = '';
            
            function tryLoadImage(index) {
                if (index >= extensions.length) {
                    modalImg.src = './images/size/default_size_guide.png';
                    return;
                }
                
                const imgPath = './images/size/' + baseFileName + '.' + extensions[index];
                
                const tempImg = new Image();
                tempImg.onload = function() {
                    modalImg.src = imgPath;
                };
                tempImg.onerror = function() {
                    tryLoadImage(index + 1);
                };
                tempImg.src = imgPath;
            }
            
            tryLoadImage(0);
        });
    });
    
    // 모바일 터치 이벤트
    let startY = 0;
    let endY = 0;
    const minSwipeDistance = 50;
    
    function handleTouchStart(e) {
        startY = e.touches[0].clientY;
    }
    
    function handleTouchMove(e) {
        if (!startY) return;
        endY = e.touches[0].clientY;
    }
    
    function handleTouchEnd() {
        if (!startY || !endY) return;
        
        const diffY = startY - endY;
        if (Math.abs(diffY) < minSwipeDistance) {
            startY = 0;
            endY = 0;
            return;
        }
        
        if (diffY > 0) {
            showNextProduct();
        } else {
            showPreviousProduct();
        }
        
        startY = 0;
        endY = 0;
    }
    
    modal.addEventListener('touchstart', handleTouchStart, false);
    modal.addEventListener('touchmove', handleTouchMove, false);
    modal.addEventListener('touchend', handleTouchEnd, false);
    
    // 마우스 이벤트
    let isMouseDown = false;
    
    modal.addEventListener('mousedown', function(e) {
        isMouseDown = true;
        startY = e.clientY;
    });
    
    modal.addEventListener('mousemove', function(e) {
        if (!isMouseDown) return;
        endY = e.clientY;
    });
    
    modal.addEventListener('mouseup', function() {
        if (!isMouseDown) return;
        handleTouchEnd();
        isMouseDown = false;
    });
    
    modal.addEventListener('mouseleave', function() {
        if (isMouseDown) {
            handleTouchEnd();
            isMouseDown = false;
        }
    });
}

// 페이지 로드 시 상품 렌더링
document.addEventListener('DOMContentLoaded', function() {
    //loadProducts();
    jsLoadProducts();
}); 