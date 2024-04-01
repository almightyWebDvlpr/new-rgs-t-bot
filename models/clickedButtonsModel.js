const mongoose = require('mongoose');

// Define schema for clicked buttons
const clickedButtonsSchema = new mongoose.Schema({
    userId: {
        type: Number, // Assuming user ID is a number
       
    },
    commandName: {
        type: String,
    }
}, {
    timestamps: true // Adds createdAt and updatedAt fields automatically
});

// Define model for clicked buttons
const ClickedButtons = mongoose.model('ClickedButtons', clickedButtonsSchema);

async function saveClickedButton(userId, commandName) {
    // Only save data for specific commands
    const specificCommands = [
        "📝 Запит на навчання",
        "🆘 Запит технічної допомоги",
        "⚡ Вправи",
        "🩺💻 Інструкція для кабінету лікаря",
        "🧑🏻‍⚕️💻 Інструкція для кабінету пацієнта до пк",
        "🧑🏻‍⚕️📱 Інструкція для пацієнта до мобільного пристрою",
        "☎️ Контакт служби підтримки",
        "⚖️ Законодавство",
        "▶️ Youtube канал",
        "🎓 Майстер-класи"
    ];

    if (specificCommands.includes(commandName)) {
        await ClickedButtons.create({ userId, commandName });
    }
}

module.exports = {saveClickedButton, ClickedButtons};