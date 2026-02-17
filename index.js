const mineflayer = require('mineflayer');

function createBot() {
    const bot = mineflayer.createBot({
        host: 'R3D2002.aternos.me', // غيرها لـ IP حقك
        port: 37110,
        username: '37110',
        version: '1.21.11',
        viewDistance: 'tiny',
        chatLengthLimit: 256
    });

    bot.once('spawn', () => {
        console.log('✅ البوت دخل السيرفر!');

        // نظام AFK متطور
        let afkInterval = setInterval(() => {
            if (!bot.entity) return;

            try {
                // حركات متنوعة عشان ما ينكشف
                const actions = ['forward', 'back', 'left', 'right', 'jump'];
                const randomAction = actions[Math.floor(Math.random() * actions.length)];

                bot.setControlState(randomAction, true);
                setTimeout(() => {
                    bot.setControlState(randomAction, false);
                }, 500);

                // لف خفيف
                bot.look(Math.random() * Math.PI * 2, 0);

                console.log(`🔄 حركة AFK: ${randomAction}`);
            } catch (err) {
                console.log('خطأ في حركة AFK:', err);
            }
        }, 45000); // كل 45 ثانية
    });

    // معالجة الأخطاء
    bot.on('error', (err) => {
        console.log('❌ خطأ:', err.message);
        if (afkInterval) clearInterval(afkInterval);
    });

    bot.on('end', (reason) => {
        console.log('🔌 انقطع الاتصال. السبب:', reason || 'غير معروف');
        if (afkInterval) clearInterval(afkInterval);

        console.log('⏳ نحاول إعادة الاتصال بعد 10 ثواني...');
        setTimeout(createBot, 10000);
    });

    bot.on('kicked', (reason) => {
        console.log('👢 تم طرد البوت:', reason);
        if (afkInterval) clearInterval(afkInterval);
        setTimeout(createBot, 15000);
    });
}

// بدء البوت
createBot();