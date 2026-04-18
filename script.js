const curriculumData = {
    hobby: {
        title: "취미반",
        details: ["1:1 맞춤 에임 트레이닝", "기본적인 맵 전략 숙달", "팀 협력 및 커뮤니케이션", "즐거움을 위한 게임 플레이법"]
    },
    rank: {
        title: "랭크반",
        details: ["고급 에임 메커니즘", "라운드 운영 및 심리전", "상세 데모 리플레이 분석", "불리한 상황 역전 전술"]
    },
    pro: {
        title: "프로반",
        details: ["프로 팀 전술 시스템 이식", "체계적인 피지컬 트레이닝", "대회 환경 적응 및 멘탈리티", "프로팀 테스트 기회 제공"]
    }
};

window.openModal = (type) => {
    const data = curriculumData[type];
    const modal = document.getElementById('detailModal');
    const body = document.getElementById('modalBody');
    if (!modal || !data) return;

    document.querySelectorAll('.class-card').forEach(card => card.classList.remove('active-card'));
    const selectedCard = document.getElementById(`card-${type}`);
    if (selectedCard) selectedCard.classList.add('active-card');

    modal.className = `modal ${type}-modal`;
    body.innerHTML = `
        <div class="modal-info">
            <h2>${data.title}</h2>
            <ul>${data.details.map(item => `<li>${item}</li>`).join('')}</ul>
            <button class="btn-main" style="margin-top: 40px; width: 100%;" onclick="location.href='contact.html'">상담 신청하기</button>
        </div>
    `;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
};

window.closeModal = () => {
    const modal = document.getElementById('detailModal');
    if (modal) modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    document.querySelectorAll('.class-card').forEach(card => card.classList.remove('active-card'));
};

window.addEventListener('click', (event) => {
    if (event.target === document.getElementById('detailModal')) closeModal();
});

document.addEventListener('DOMContentLoaded', () => {
    
    const menuToggle = document.getElementById('mobile-menu');
    const navLinks = document.getElementById('navLinks');
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : 'auto';
        });
    }

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => { 
            if (entry.isIntersecting) entry.target.classList.add('active'); 
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


    const discordGroup = document.getElementById('discordInputGroup');
    const submitBtn = document.querySelector('.btn-submit');
    const allRequiredInputs = document.querySelectorAll('#contactForm input[required]');

    document.querySelectorAll('.custom-select').forEach(select => {
        const trigger = select.querySelector('.select-trigger');
        const options = select.querySelectorAll('.option');
        const hiddenInput = select.querySelector('input[type="hidden"]');
        const label = trigger.querySelector('span');

        trigger.addEventListener('click', (e) => {
            document.querySelectorAll('.custom-select').forEach(s => { if (s !== select) s.classList.remove('open'); });
            select.classList.toggle('open');
            e.stopPropagation();
        });

        options.forEach(opt => {
            opt.addEventListener('click', () => {
                const val = opt.getAttribute('data-value');
                label.innerText = opt.innerText;
                hiddenInput.value = val;

                if (hiddenInput.id === 'consultType') {
                    if (val === '디스코드') {
                        discordGroup.style.display = 'flex';
                        if(submitBtn) submitBtn.style.display = 'none';
                        allRequiredInputs.forEach(input => input.required = false);
                    } else {
                        discordGroup.style.display = 'none';
                        if(submitBtn) submitBtn.style.display = 'block'; 
                        allRequiredInputs.forEach(input => input.required = true);
                    }
                }

                options.forEach(o => o.classList.remove('selected'));
                opt.classList.add('selected');
                select.classList.remove('open');
            });
        });
    });

    window.addEventListener('click', () => {
        document.querySelectorAll('.custom-select').forEach(s => s.classList.remove('open'));
    });

    const birthInput = document.getElementById('userBirth');
    const parentSection = document.getElementById('parentSection');

    if (birthInput) {
        birthInput.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9]/g, '');

            if (this.value.length === 8) {
                const year = parseInt(this.value.substring(0, 4));
                const month = parseInt(this.value.substring(4, 6)) - 1;
                const day = parseInt(this.value.substring(6, 8));
                const birthDate = new Date(year, month, day);
                const today = new Date();

                if (!isNaN(birthDate.getTime()) && birthDate < today) {
                    let age = today.getFullYear() - birthDate.getFullYear();
                    const m = today.getMonth() - birthDate.getMonth();
                    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;

                    const isDiscord = document.getElementById('consultType').value === '디스코드';
                    if (age < 19 && age > 0) {
                        parentSection.classList.add('active');
                        parentSection.querySelectorAll('input').forEach(i => i.required = !isDiscord);
                    } else {
                        parentSection.classList.remove('active');
                        parentSection.querySelectorAll('input').forEach(i => i.required = false);
                    }
                }
            } else {
                parentSection.classList.remove('active');
            }
        });
    }

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            const consultType = document.getElementById('consultType').value;
            
            if (consultType === '디스코드') {
                e.preventDefault();
                return;
            }

            e.preventDefault();
            const btn = contactForm.querySelector('.btn-submit');
            
            const formData = {
                name: document.getElementById('userName').value,
                phone: document.getElementById('userPhone').value,
                birth: document.getElementById('userBirth').value,
                parentPhone: document.getElementById('parentPhone')?.value || "해당없음",
                parentRelation: document.getElementById('parentRelation')?.value || "해당없음",
                consultType: consultType,
                field: document.getElementById('consultField').value,
                question: document.getElementById('userQuestion').value
            };

            btn.innerText = "상담 신청서 전송 중...";
            btn.disabled = true;

            try {
                const response = await fetch('http://localhost:3000/api/consult', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    alert("상담 신청이 성공적으로 완료되었습니다!");
                    contactForm.reset();
                    if(parentSection) parentSection.classList.remove('active');
                    if(discordGroup) discordGroup.style.display = 'none';
                } else {
                    throw new Error('전송 실패');
                }
            } catch (error) {
                console.error('Error:', error);
                alert("서버 연결에 실패했습니다. 관리자에게 문의해주세요.");
            } finally {
                btn.innerText = "상담 신청서 전송하기";
                btn.disabled = false;
            }
        });
    }
});
document.addEventListener('DOMContentLoaded', () => {
    const imgPopup = document.getElementById('imagePopup');
    const expiry = localStorage.getItem('adPopupExpiry');
    const now = new Date().getTime();

    if (!expiry || now > parseInt(expiry)) {
        imgPopup.style.display = 'block';
    }

    window.closePopup24h = () => {
        const expiryTime = new Date().getTime() + (24 * 60 * 60 * 1000);
        localStorage.setItem('adPopupExpiry', expiryTime);
        imgPopup.style.display = 'none';
    };

    window.closePopupOnly = () => {
        imgPopup.style.display = 'none';
    };
});