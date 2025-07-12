# CryptoAlert Pro - Professional Cryptocurrency Monitoring Platform

A modern, interactive cryptocurrency price monitoring and alert system built with Node.js, Express, MongoDB, and EJS.

## 🌟 Features

- **Real-time Price Monitoring**: Live cryptocurrency price updates
- **Price Alerts**: Set custom price thresholds and get email notifications
- **Modern UI/UX**: Professional dark theme with animations and gradients
- **Interactive Dashboard**: Statistics cards, search functionality, and charts
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Auto-refresh**: Automatic price updates every 30 seconds
- **Toast Notifications**: Real-time feedback for user actions

## 🚀 Quick Start

### Prerequisites

1. **Node.js** (v14 or higher)
2. **MongoDB** (running on localhost:27017)
3. **npm** or **yarn**

### Installation

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start MongoDB**:
   - Make sure MongoDB is running on your system
   - Default connection: `mongodb://127.0.0.1:27017/cryptoDB`

3. **Run the Application**:
   ```bash
   # Production mode
   npm start
   
   # Development mode (with auto-restart)
   npm run dev
   ```

4. **Access the Application**:
   - Open your browser and go to: `http://localhost:3000`

## 📁 Project Structure

```
CryptoCurrencyAlertSystem/
├── app.js                 # Main server file
├── package.json           # Dependencies and scripts
├── public/               # Static files
│   ├── css/
│   │   └── style.css     # Modern CSS styles
│   └── js/
│       └── app.js        # Interactive JavaScript
├── views/                # EJS templates
│   ├── index.ejs         # Main dashboard
│   ├── setAlert.ejs      # Alert creation form
│   ├── addCrypto.ejs     # Add cryptocurrency form
│   └── removeAlert.ejs   # Alert management
└── models/               # MongoDB models
    ├── Crypto.js         # Cryptocurrency model
    └── Alert.js          # Alert model
```

## 🎨 Design Features

- **Dark Theme**: Professional dark color scheme
- **Gradient Animations**: Smooth background animations
- **Floating Particles**: Interactive particle effects
- **Card-based Layout**: Modern card design with hover effects
- **Responsive Grid**: Bootstrap-based responsive layout
- **Custom Icons**: Font Awesome icons throughout
- **Smooth Transitions**: CSS animations and transitions

## 🔧 Technical Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Frontend**: EJS templating, Bootstrap 5, Custom CSS
- **APIs**: CoinGecko API for cryptocurrency prices
- **Icons**: Font Awesome 6
- **Charts**: Chart.js (optional)

## 📊 Dashboard Features

- **Statistics Cards**: Total cryptocurrencies, active alerts, total value
- **Live Price Table**: Real-time cryptocurrency prices with actions
- **Search Functionality**: Filter cryptocurrencies by name/symbol
- **Alert Management**: Create, view, and delete price alerts
- **Price Updates**: Manual and automatic price refresh
- **Interactive Elements**: Hover effects, tooltips, and animations

## 🚨 Alert System

- **Price Thresholds**: Set custom price levels for notifications
- **Email Notifications**: Receive alerts via email
- **Real-time Validation**: API validation for cryptocurrency symbols
- **Alert Management**: View and manage all active alerts

## 🎯 For Google Application

This project demonstrates:

- **Modern Web Development**: Latest technologies and best practices
- **Professional UI/UX**: High-quality, interactive user interface
- **Real-time Features**: Live data updates and notifications
- **Responsive Design**: Mobile-first approach
- **Clean Code**: Well-structured, maintainable codebase
- **API Integration**: External API usage (CoinGecko)
- **Database Design**: MongoDB with proper schemas
- **Error Handling**: Comprehensive error management

## 🔍 API Endpoints

- `GET /` - Main dashboard
- `POST /update-prices` - Update cryptocurrency prices
- `GET /set-alert` - Alert creation form
- `POST /set-alert` - Create new alert
- `GET /add-crypto` - Add cryptocurrency form
- `POST /add-crypto` - Add new cryptocurrency
- `GET /remove-alert` - Alert management page
- `POST /remove-alert` - Delete alert

## 🛠️ Development

### Running in Development Mode
```bash
npm run dev
```
This uses nodemon for automatic server restart on file changes.

### Adding New Features
1. Create new routes in `app.js`
2. Add corresponding EJS templates in `views/`
3. Update CSS in `public/css/style.css`
4. Add JavaScript functionality in `public/js/app.js`

## 📱 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## 🔐 Security Features

- Input validation and sanitization
- API error handling
- Secure form submissions
- XSS protection through EJS templating

## 📈 Performance

- Optimized CSS and JavaScript
- Efficient database queries
- Cached API responses
- Responsive image loading

---

**Built with ❤️ for professional cryptocurrency monitoring** 
