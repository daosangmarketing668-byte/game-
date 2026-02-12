# 🎮 SIÊU CÂU LỆNH PRO MAX - Game Phản Xạ Tốc Độ 3D

[![GitHub Pages](https://img.shields.io/badge/GitHub-Pages-blue.svg)](https://yourusername.github.io/reaction-game-pro-max/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

Một game phản xạ tốc độ 3D chuyên nghiệp với hiệu ứng cao cấp, được xây dựng hoàn toàn bằng HTML, CSS, và JavaScript thuần.

## ✨ Tính Năng Nổi Bật

### 🎮 Gameplay Chuyên Nghiệp
- **5 Levels Độ Khó Tăng Dần** - Từ cơ bản đến siêu khó
- **Hệ Thống Đo Thời Gian Chính Xác** - Đo phản xạ theo milliseconds
- **Multi-Target System** - Nhiều mục tiêu cho level cao
- **Fake Signals** - Tín hiệu giả để tăng độ khó
- **Time Limits** - Giới hạn thời gian cho level cao nhất

### 🎨 Giao Diện 3D Pro Max
- **Glassmorphism Design** - Hiệu ứng kính mờ hiện đại
- **Neon Glow Effects** - Hiệu ứng phát sáng neon
- **3D Transforms** - Chuyển động 3D mượt mà
- **Particle System** - Hệ thống hạt động với Canvas
- **Dark/Light Mode** - Chuyển đổi theme dễ dàng
- **Responsive Design** - Tương thích mọi thiết bị

### 🏆 Hệ Thống Xếp Hạng
- **Leaderboard Top 10** - Lưu điểm cao nhất
- **LocalStorage Persistence** - Dữ liệu được lưu trữ cục bộ
- **Player Statistics** - Thống kê chi tiết người chơi
- **Level Progression** - Theo dõi tiến độ lên level

### 🎵 Âm Thanh & Hiệu Ứng
- **Web Audio API** - Âm thanh được tạo lập trình
- **Vibration API** - Rung động trên mobile
- **Visual Feedback** - Phản hồi hình ảnh tức thì
- **Smooth Animations** - Animation mượt mà 60fps

## 🚀 Cách Chơi

1. **Nhập Tên** - Điền tên của bạn vào ô input
2. **Bắt Đầu** - Click nút "BẮT ĐẦU CHƠI"
3. **Chờ Tín Hiệu** - Chờ màn hình hiện "CLICK!"
4. **Click Nhanh** - Click thật nhanh khi thấy tín hiệu
5. **Không Click Quá Sớm** - Click trước tín hiệu sẽ bị thua
6. **Thu Thập Điểm** - Càng nhanh càng nhiều điểm
7. **Lên Level** - Đủ điểm sẽ tự động lên level

### 🎯 Phân Loại Phản Xạ
- **< 200ms** → 🦸‍♂️ "Siêu Nhân"
- **200-300ms** → ⚡ "Cao Thủ"
- **300-400ms** → 👍 "Bình Thường"
- **> 400ms** → 💪 "Cần Luyện Thêm"

## 🛠️ Cài Đặt & Chạy

### Clone Repository
```bash
git clone https://github.com/yourusername/reaction-game-pro-max.git
cd reaction-game-pro-max
```

### Chạy Local
```bash
# Mở file trực tiếp trong browser
open reaction-game-pro-max.html

# Hoặc chạy với local server
python -m http.server 8000
# Mở http://localhost:8000/reaction-game-pro-max.html
```

### Deploy lên GitHub Pages
1. Fork repository này
2. Vào `Settings` → `Pages`
3. Chọn `Deploy from a branch`
4. Chọn `main` branch và `/ (root)`
5. Click `Save`
6. Game sẽ available tại `https://yourusername.github.io/reaction-game-pro-max/`

## 📁 Cấu Trúc File

```
reaction-game-pro-max/
├── reaction-game-pro-max.html    # Main HTML file
├── reaction-game-style.css       # Stylesheet
├── reaction-game-script.js       # Game logic
├── README.md                     # Documentation
└── .gitignore                    # Git ignore file
```

## 🎮 Controls

### Desktop
- **Mouse Click** - Click vào game area
- **Spacebar** - Phím tắt để click
- **Enter** - Bắt đầu game (từ welcome screen)

### Mobile
- **Touch** - Chạm vào game area
- **Vibration** - Rung khi có phản hồi

## ⚙️ Cấu Hình Level

| Level | Thời Gian Chờ | Fake Signals | Multi-Target | Score Multiplier |
|-------|---------------|--------------|--------------|------------------|
| 1     | 1-5 giây      | ❌           | ❌           | 1x               |
| 2     | 0.8-3 giây    | ❌           | ❌           | 1.5x             |
| 3     | 0.6-2.5 giây  | ✅ (30%)     | ❌           | 2x               |
| 4     | 0.5-2 giây    | ✅ (20%)     | ✅ (4 targets) | 3x             |
| 5     | 0.3-1.5 giây  | ✅ (40%)     | ✅ (6 targets) | 5x             |

## 🌟 Tính Năng Đặc Biệt

### Glassmorphism Effects
- Backdrop filters cho hiệu ứng kính mờ
- Dynamic shadows và lighting
- Smooth transitions giữa các states

### 3D Transforms
- Perspective transforms cho cards
- Hover effects với rotation
- Depth perception

### Particle System
- Canvas-based particle animation
- Real-time rendering
- Performance optimized

### Audio System
- Web Audio API synthesis
- Dynamic sound generation
- No external audio files needed

## 🔧 Customization

### Thay Đổi Màu Sắc
Sửa CSS variables trong `:root`:
```css
:root {
    --accent-color: #00ff88;
    --danger-color: #ff4757;
    /* ... */
}
```

### Thay Đổi Level Config
Sửa `LevelConfig` trong JavaScript:
```javascript
const LevelConfig = {
    1: {
        minWaitTime: 1000,
        maxWaitTime: 5000,
        // ...
    }
};
```

### Thêm Sound Effects
Sửa `setupAudio()` method:
```javascript
this.sounds = {
    start: () => this.playTone(440, 0.1, 'sine'),
    // Thêm sounds mới...
};
```

## 📱 Mobile Optimization

- **Touch Events** - Optimized cho mobile
- **Vibration API** - Haptic feedback
- **Responsive Layout** - Adaptive design
- **Performance** - 60fps animations
- **Battery Efficient** - Optimized rendering

## 🎯 Performance Features

- **RequestAnimationFrame** - Smooth 60fps
- **Debounced Events** - Prevent spam
- **Memory Management** - Clean garbage collection
- **Lazy Loading** - Load on demand
- **Optimized Particles** - Efficient rendering

## 🌐 Browser Support

| Browser | Version | Support |
|---------|---------|----------|
| Chrome  | 60+     | ✅ Full   |
| Firefox | 55+     | ✅ Full   |
| Safari  | 12+     | ✅ Full   |
| Edge    | 79+     | ✅ Full   |

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push branch: `git push origin feature/amazing-feature`
5. Submit Pull Request

## 📝 License

Project này được licensed dưới MIT License - xem [LICENSE](LICENSE) file cho details.

## 🙏 Credits

- **Design Inspiration** - Modern gaming UI trends
- **Audio Generation** - Web Audio API
- **Particle Effects** - Canvas animation techniques
- **Glassmorphism** - Modern CSS effects

## 📞 Contact

- **GitHub** - [@yourusername](https://github.com/yourusername)
- **Email** - your.email@example.com
- **Twitter** - [@yourhandle](https://twitter.com/yourhandle)

---

**Made with ❤️ and lots of ☕**

**Enjoy the game! 🎮✨**
