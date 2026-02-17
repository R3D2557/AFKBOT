const mineflayer = require('mineflayer');
const http = require('http');

// هذا ضروري عشان Render ما يوقف البوت
const PORT = process.env.PORT || 3000;
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
        <html>
            <head><title>Minecraft AFK Bot</title></head>
            <body style="font-family: Arial; text-align: center; padding: 50px;">
                <h1>🤖 Minecraft AFK Bot is Running!</h1>
                <p>البوت شغال 24/7 على Aternos</p>
                <p>🟢 الحالة: متصل</p>
                <p>🕒 آخر تحديث: ${new Date().toLocaleString('ar-SA')}</p>
            </body>
        </html>
    `);
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`🌐 واجهة المراقبة شغالة على بورت ${PORT}`);
});

// بيانات السيرفر حقك - غيرها
const SERVER_IP = 'example.aternos.me';  // غيرها لـ IP حقك
const SERVER_PORT = 25565;
const BOT_USERNAME = 'AFKBot_' + Math.floor(Math.random() * 1000);

console.log('🤖 بدء تشغيل البوت...');
console.log(`📡 السيرفر: ${SERVER_IP}:${SERVER_PORT}`);
console.log(`👤 اسم البوت: ${BOT_USERNAME}`);

let bot = null;
let afkInterval = null;

function createBot() {
    if (bot) {
        try {
            bot.end();
        } catch (e) {}
        bot = null;
    }
    
    if (afkInterval) {
        clearInterval(afkInterval);
        afkInterval = null;
    }
    
    console.log('🔄 محاولة اتصال جديدة...');
    
    bot = mineflayer.createBot({
        host: R3D2002.aternos.me,
        port: 37110,
        username: R3DBOT,
        version: '1.21.11',
        viewDistance: 'tiny',
        keepAlive: true
    });

    bot.once('spawn', () => {
        console.log('✅ البوت دخل السيرفر بنجاح!');
        
        // حركة AFK كل 30 ثانية
        if (afkInterval) clearInterval(afkInterval);
        
        afkInterval = setInterval(() => {
            if (!bot || !bot.entity) return;
            
            try {
                // حركات متنوعة
                const actions = ['forward', 'back', 'left', 'right'];
                const randomAction = actions[Math.floor(Math.random() * actions.length)];
                
                bot.setControlState(randomAction, true);
                setTimeout(() => {
                    if (bot) bot.setControlState(randomAction, false);
                }, 300);
                
                if (bot) bot.look(Math.random() * Math.PI * 2, 0);
                
                console.log(`🔄 حركة AFK: ${randomAction} - ${new Date().toLocaleTimeString()}`);
            } catch (err) {
                console.log('⚠️ خطأ في حركة AFK:', err.message);
            }
        }, 30000);
    });

    bot.on('end', (reason) => {
        console.log(`❌ انقطع الاتصال: ${reason || 'سبب غير معروف'}`);
        if (afkInterval) {
            clearInterval(afkInterval);
            afkInterval = null;
        }
        console.log('⏳ محاولة إعادة الاتصال بعد 15 ثانية...');
        setTimeout(createBot, 15000);
    });

    bot.on('error', (err) => {
        console.log('⚠️ خطأ:', err.message);
    });

    bot.on('kicked', (reason) => {
        console.log('👢 تم طرد البوت:', reason);
        if (afkInterval) {
            clearInterval(afkInterval);
            afkInterval = null;
        }
        setTimeout(createBot, 20000);
    });
}

// بدء البوت
createBot();

// معالجة الأخطاء غير المتوقعة
process.on('uncaughtException', (err) => {
    console.log('💥 خطأ غير متوقع:', err);
    setTimeout(createBot, 5000);
});

process.on('unhandledRejection', (err) => {
    console.log('💥 وعد مرفوض:', err);
});

console.log('🚀 البوت جاهز للعمل 24/7 على Render');
