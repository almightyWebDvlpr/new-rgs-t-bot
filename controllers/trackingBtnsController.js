const {ClickedButtons}= require("../models/clickedButtonsModel.js");

exports.getAllTrackingRequests = async (req, res) => {
    try {
      const trackingRequests = await ClickedButtons.find({});

      const commandCounts = {
        "📝 Запит на навчання": 0,
        "🆘 Запит технічної допомоги": 0,
        "⚡ Вправи": 0,
        "🩺💻 Інструкція для кабінету лікаря": 0,
        "🧑🏻‍⚕️💻 Інструкція для кабінету пацієнта до пк": 0,
        "🧑🏻‍⚕️📱 Інструкція для пацієнта до мобільного пристрою": 0,
        "☎️ Контакт служби підтримки": 0,
        "⚖️ Законодавство": 0,
        "▶️ Youtube канал": 0,
        "🎓 Майстер-класи": 0
    };
    const uniqueUserIds = new Set();

    // Loop through clicked buttons data and count occurrences of specific commands
    trackingRequests.forEach(button => {
        if (button.commandName in commandCounts) {
            commandCounts[button.commandName]++;
        }
         uniqueUserIds.add(button.userId);
    });

    const uniqueUserCount = uniqueUserIds.size;

    res.json({ trackingRequests, commandCounts, uniqueUserCount  });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: "Server Error" });
    }
  }