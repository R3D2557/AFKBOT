const mineflayer = require('mineflayer');
const http = require('http');

// للـ Render
const PORT = process.env.PORT || 3000;
http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Minecraft AFK Bot is running!\n');
}).listen(PORT, '0.0.0.0');

console.log('🚀 بدء تشغيل البوت...');

// غير هنا لـ IP سيرفر Aternos حقك
const SERVER_IP = 'R3D2002.aternos.me';  // مهم: غير هذا
const SERVER_PORT = 37110;

function connect() {
    console.log(`🔄 محاولة الاتصال بـ ${SERVER_IP}:${SERVER_PORT}...`);
    
    const bot = mineflayer.createBot({
        host: SERVER_IP,
        port: SERVER_PORT,
        username: 'AFKBot_' + Math.floor(Math.random() * 1000),
        version: '1.20.4'
    });

    bot.on('login', () => {
        console.log('✅ تم تسجيل الدخول!');
    });

    bot.on('spawn', () => {
        console.log('🎉 دخلت السيرفر!');
        
        // حركة بسيطة كل دقيقة
        setInterval(() => {
            try {
                bot.setControlState('jump', true);
                setTimeout(() => bot.setControlState('jump', false), 500);
                bot.chat('I am AFK bot');
                console.log('🔄 تحرك AFK');
            } catch (e) {}
        }, 60000);
    });

    bot.on('end', (reason) => {
        console.log(`❌ انقطع الاتصال: ${reason}`);
        console.log('⏳ محاولة جديدة بعد 10 ثواني...');
        setTimeout(connect, 10000);
    });

    bot.on('error', (err) => {
        console.log('⚠️ خطأ:', err.message);
    });

    bot.on('kicked', (reason) => {
        console.log('👢 طرد:', reason);
        setTimeout(connect, 15000);
    });
}

// ابدأ
connect();
