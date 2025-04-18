/* ---------------- 侧边栏导航高亮 & 平滑跳转 ---------------- */
const navLinks = document.querySelectorAll('.nav-link');
const watchTargets = document.querySelectorAll(
  '.paper-info, .gallery-section, .paper-citation, .contact-us'
);

navLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    document
      .querySelector(link.getAttribute('href'))
      .scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

const io = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = `#${entry.target.id}`;
        navLinks.forEach(l =>
          l.classList.toggle('active', l.getAttribute('href') === id)
        );
      }
    });
  },
  { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
);
watchTargets.forEach(t => io.observe(t));

/* ---------------- 视频画廊组件 ---------------- */
// slides 统一收集
const slides = Array.from(
  document.querySelectorAll('#videoContainer .video-slide')
);

/* ---------------- 缩略图组件 ---------------- */
// 允许两种 HTML 结构：
//  1.  <div class="thumbs-wrapper"><div id="videoThumbnails">…</div></div>
//  2.  <div class="thumbs-wrapper" id="videoThumbnails">…</div>
// 若缺 id，则脚本退而使用 .thumbs-wrapper 本身
const thumbRow =
  document.getElementById('videoThumbnails') ||
  document.querySelector('.thumbs-wrapper');

const thumbs = Array.from(thumbRow.querySelectorAll('.thumbnail'));

// 缩略图左右滚动按钮（可选）
const thumbPrev = document.querySelector('.thumb-prev');
const thumbNext = document.querySelector('.thumb-next');

// 播放器左右切换按钮
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');

let current = 0;

/* ----------- 工具函数 ----------- */
function centerThumb(i) {
  const thumb = thumbs[i];
  if (!thumb) return;
  const offset =
    thumb.offsetLeft - thumbRow.clientWidth / 2 + thumb.clientWidth / 2;
  thumbRow.scrollTo({ left: offset, behavior: 'smooth' });
}

/* 初始化 */
function initPlayer() {
  slides.forEach((slide, i) => {
    const v = slide.querySelector('video');
    if (!v) return;
    v.loop = false;                 // 禁掉 loop 以便触发 ended
    v.pause();
    v.currentTime = 0;
    if (i !== 0) slide.style.display = 'none';
    v.addEventListener('ended', () => playVideo((i + 1) % slides.length));
  });

  thumbs[0]?.classList.add('active');
  slides[0]?.querySelector('video').play();
  centerThumb(0);
}

function playVideo(index) {
  if (!slides.length) return;
  const next = (index + slides.length) % slides.length;
  if (next === current) return;

  // 隐藏当前
  const curSlide = slides[current];
  curSlide.querySelector('video').pause();
  curSlide.style.display = 'none';
  thumbs[current]?.classList.remove('active');

  // 显示新的
  current = next;
  const newSlide = slides[current];
  const newVideo = newSlide.querySelector('video');
  newSlide.style.display = 'block';
  newVideo.currentTime = 0;
  newVideo.play();
  thumbs[current]?.classList.add('active');
  centerThumb(current);
}

/* ---- 事件绑定 ---- */
thumbs.forEach((t, i) => t.addEventListener('click', () => playVideo(i)));
prevBtn?.addEventListener('click', () => playVideo(current - 1));
nextBtn?.addEventListener('click', () => playVideo(current + 1));

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft') playVideo(current - 1);
  if (e.key === 'ArrowRight') playVideo(current + 1);
});

thumbPrev?.addEventListener('click', () => {
  thumbRow.scrollBy({ left: -thumbRow.clientWidth * 0.8, behavior: 'smooth' });
});
thumbNext?.addEventListener('click', () => {
  thumbRow.scrollBy({ left: thumbRow.clientWidth * 0.8, behavior: 'smooth' });
});

/* 启动 */
initPlayer();

/* ---------- 全屏控制 ---------- */
function toggleFullScreen(elem){
    if (!document.fullscreenElement) {
      (elem.requestFullscreen || elem.webkitRequestFullscreen ||
       elem.mozRequestFullScreen || elem.msRequestFullscreen).call(elem);
    } else {
      (document.exitFullscreen || document.webkitExitFullscreen ||
       document.mozCancelFullScreen || document.msExitFullscreen).call(document);
    }
  }
  
  /* 双击当前视频 -> 全屏 / 退出 */
  slides.forEach(s => {
    const v = s.querySelector('video');
    v.addEventListener('dblclick', () => toggleFullScreen(v));
  });
  
  /* 键盘 F 键 切换全屏 */
  document.addEventListener('keydown', e => {
    if (e.key.toLowerCase() === 'f') {
      const v = slides[current].querySelector('video');
      toggleFullScreen(v);
    }
  });
  
