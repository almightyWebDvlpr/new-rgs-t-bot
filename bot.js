const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
const {
  mainMenuKeyboard,
  instructionsMenuKeyboard,
  infoMenuKeyboard,
  exercisesMenuKeyboard,
  trainingEcercisesMobile,
} = require("./botComponents/menus.js");
const { generateMenuMarkup } = require("./botComponents/dateMenu.js");
const { saveClickedButton } = require("./models/clickedButtonsModel.js");
module.exports = function (io) {
  const token = process.env.TELEGRAM_TOKEN;

  const bot = new TelegramBot(token, {
    polling: true,
  });

  function sendNotification(message) {
    console.log(message, "sendNotification");
    io.emit("message", { message });
  }
  function sendSupportNotification(message) {
    console.log(message, "sendNotification");
    io.emit("support", { message });
  }

  const commands = [
    { command: "start", description: "Запуск бота" },
    { command: "menu", description: "Меню" },
  ];
  bot.setMyCommands(commands);

  // Function to wait for user response
  function waitForReply(chatId) {
    return new Promise((resolve) => {
      bot.once("message", (msg) => {
        resolve(msg);
      });
    });
  }

  let isFirstMenuCall = true;

  async function waitForDateSelection(chatId) {
    // Function to wait for date selection
    return new Promise((resolve) => {
      bot.once("callback_query", async (callbackQuery) => {
        const callbackData = callbackQuery.data;
        if (callbackData.startsWith("select_date")) {
          const selectedDateIndex = callbackData.lastIndexOf("_");
          const selectedDate = callbackData.substring(selectedDateIndex + 1);
          console.log("Selected date:", selectedDate);
          resolve({ text: selectedDate });
        } else if (callbackData.startsWith("navigate_month")) {
          const yearMonthMatch = callbackData.match(/(\d{4})-(\d{2})$/);
          const year = yearMonthMatch
            ? parseInt(yearMonthMatch[1])
            : new Date().getFullYear();
          const month = yearMonthMatch
            ? parseInt(yearMonthMatch[2])
            : new Date().getMonth() + 1;

          const menuMarkup = generateMenuMarkup(year, month);

          await bot.editMessageText(
            `Оберіть день проведення навчання ${year}-${month
              .toString()
              .padStart(2, "0")}:`,
            {
              chat_id: chatId,
              message_id: callbackQuery.message.message_id,
              reply_markup: {
                inline_keyboard: menuMarkup,
              },
            }
          );

          // Re-listen for date selection after navigating to a new month
          waitForDateSelection(chatId).then(resolve);
        }
      });
    });
  }

  async function waitForTimeSelection(chatId) {
    // Function to wait for time selection
    return new Promise((resolve) => {
      let resolved = false; // Flag to track if callback has been resolved

      const callbackHandler = async (callbackQuery) => {
        if (resolved) return; // Ignore callback if already resolved
        const callbackData = callbackQuery.data;
        if (callbackData.startsWith("select_time")) {
          const selectedTimeIndex = callbackData.lastIndexOf("_");
          const selectedTime = callbackData.substring(selectedTimeIndex + 1);
          console.log("Selected time:", selectedTime);
          resolved = true; // Set the flag to indicate callback has been resolved
          bot.removeListener("callback_query", callbackHandler); // Remove the listener
          resolve({ text: selectedTime });
        } else if (callbackData === "your_option") {
          bot.sendMessage(chatId, `Вкажіть бажаний час:`);
          bot.once("message", (msg) => {
            const customTime = msg.text.trim();
            console.log("Custom time:", customTime);
            resolved = true; // Set the flag to indicate callback has been resolved
            resolve({ text: customTime });
          });
        }
      };

      bot.on("callback_query", callbackHandler);
    });
  }

  async function sendStartMessage(msg) {
    if (msg.text && msg.text.length > 6) {
      const refID = msg.text.slice(7);
      await bot.sendMessage(
        msg.chat.id,
        `Ви зашли по посиланню користувача з ID ${refID}`
      );
    }

    const startMessage = `Цей бот створений для підтримки користувачів RGS. Меню доступне за командою /menu`;

    // Check if the bot has the necessary permissions to send messages
    const botInfo = await bot.getMe();
    console.log(botInfo); // Check if the bot has permission to send messages

    await bot.sendMessage(msg.chat.id, startMessage, {
      reply_markup: {
        keyboard: [],
        resize_keyboard: true,
        one_time_keyboard: true, // Show keyboard once
        request_contact: true, // Request access to contact
      },
    });
  }

  async function sendMainMenuMessage(msg) {
    await bot.sendMessage(msg.chat.id, `Меню бота`, {
      force_reply: true,
      reply_markup: {
        keyboard: mainMenuKeyboard,
        resize_keyboard: false,
        one_time_keyboard: true,
      },
    });
  }
  async function closeMenu(msg) {
    await bot.sendMessage(msg.chat.id, "Меню закрито", {
      reply_markup: { remove_keyboard: true },
    });
  }

  async function trainingRequest(msg) {
    const chatId = msg.chat.id;

    if (isFirstMenuCall) {
      bot.sendMessage(
        chatId,
        "Вітаємо, підкажіть будь-ласка чи проводили для вашого закладу навчання?:"
      );

      const wasThereTrainingResponse = await waitForReply(chatId);
      const wasThereTraining = wasThereTrainingResponse.text;

      bot.sendMessage(
        chatId,
        "Будь-ласка, вкажіть назву закладу або ЄДРПОУ закладу:"
      );

      const hospitalResponse = await waitForReply(chatId);
      const hospitalName = hospitalResponse.text;

      bot.sendMessage(
        chatId,
        "Будь-ласка, вкажіть як до Вас звертатися (ПІБ):"
      );

      const recipientResponse = await waitForReply(chatId);
      const recipientName = recipientResponse.text;

      bot.sendMessage(
        chatId,
        "Будь-ласка, вкажіть ваш контактий номер телефону:"
      );

      const recipientPhoneResponse = await waitForReply(chatId);
      const recipientPhone = recipientPhoneResponse.text;

      // isFirstMenuCall = false;

      const today = new Date();
      const currentYear = today.getFullYear();
      const currentMonth = today.getMonth() + 1;
      const menuMarkup = generateMenuMarkup(currentYear, currentMonth);
      await bot.sendMessage(chatId, "Оберіть дату проведення навчання:", {
        force_reply: true,
        reply_markup: {
          inline_keyboard: menuMarkup,
        },
      });

      const dateResponse = await waitForDateSelection(chatId);
      const timeOptions = [
        ["10:00 - 11:00", "11:00 - 12:00"],
        ["12:00 - 13:00", "13:00 - 14:00"],
        ["14:00 - 15:00", "15:00 - 16:00"],
        ["16:00 - 17:00", "Ваш варіант"],
      ];

      const timeOptionsMarkup = timeOptions.map((row) => {
        return row.map((timeOption) => {
          if (timeOption === "Ваш варіант") {
            return {
              text: timeOption,
              callback_data: `your_option`,
            };
          } else {
            return {
              text: timeOption,
              callback_data: `select_time_${dateResponse.text}_${timeOption}`,
            };
          }
        });
      });

      await bot.sendMessage(
        chatId,
        `Та обіріть бажаний час на - ${dateResponse.text}:`,
        {
          reply_markup: {
            inline_keyboard: timeOptionsMarkup,
          },
        }
      );

      const timeResponse = await waitForTimeSelection(chatId);

      bot.sendMessage(
        chatId,
        "Вкажіть перелік учасників (ПІБ, Електронну адресу):"
      );
      const presentResponse = await waitForReply(chatId);

      const trainingRequest = {
        was_there_training: wasThereTraining,
        hospital_name: hospitalName,
        recipient_name: recipientName,
        recipient_phone: recipientPhone,
        date: dateResponse.text,
        time: timeResponse.text,
        participants: presentResponse.text,
      };
      console.log(trainingRequest);

      await insertDocument(msg, trainingRequest);
    } else {
      // Handling for subsequent menu calls
    }
  }

  async function insertDocument(msg, document) {
    await bot.sendChatAction(msg.chat.id, "typing");
    try {
      const headers = {
        "Content-Type": "application/json",
      };
      const response = await axios.post(
        "https://new-rgs-bot-e6e357c7268f.herokuapp.com/api/training-requests",
        document,
        { headers }
      );
      await sendNotification(response.data);
      console.log("Response from Express.js:", response.data);
      bot.sendMessage(
        msg.chat.id,
        "Дякуємо за запит! Запрошеня на навчання буде надіслано всім учасникам на електронну пошту."
      );
    } catch (error) {
      console.error("Error sending data to Express.js:", error);
    }
  }

  async function sendSupportContact(msg) {
    const contactInfo = `
      
    📞 <b style="color: blue;">Телефон з організаційних питань:</b> +380(66)875-60-94
          \n---------------------------------------
    📞 <b>Телефон служби підтримки:</b> +380(63)439-06-02
          \n---------------------------------------
      
          📧 <b>Email:</b> rgs.info.ua@ukr.net
          `;

    await bot.sendMessage(msg.chat.id, contactInfo, { parse_mode: "HTML" });
  }

  async function sendInstructionsMenu(msg) {
    await bot.sendMessage(
      msg.chat.id,
      "Тут Ви зможете знайти інструкції по платформі.",
      {
        reply_markup: {
          keyboard: instructionsMenuKeyboard,
          resize_keyboard: true,
        },
      }
    );
  }

  async function sendExercisesInfo(msg) {
    await bot.sendMessage(
      msg.chat.id,
      "Тут Ви зможете знайти інформацію по вправах відповідно діагнозу.",
      {
        reply_markup: {
          keyboard: exercisesMenuKeyboard,
          resize_keyboard: true,
        },
      }
    );
  }

  async function sendInfoMenu(msg) {
    await bot.sendMessage(
      msg.chat.id,
      "Тут Ви зможете знайти додаткову інформацію по платформі.",
      {
        reply_markup: { keyboard: infoMenuKeyboard, resize_keyboard: true },
      }
    );
  }

  async function sendDocument(msg, path) {
    await bot.sendMessage(msg.chat.id, `Документ завантажується...`);
    await bot.sendDocument(msg.chat.id, path);
  }

  async function sendUsefulInfoMessage(msg) {
    const infoMessage = `
        <b>Тут Ви зможете знайти корисну інформацію:</b>
       
        1. <a href="https://zakon.rada.gov.ua/laws/show/2801-12#Text">Основи законодавства України про охорону здоров’я, ст. 35-6</a>
        
        2. <a href="https://moz.gov.ua/article/ministry-mandates/nakaz-moz-ukraini-vid-09062022--994-pro-provedennja-testovoi-ekspluatacii-telemedichnih-platform-sistem-v-umovah-voennogo-stanu-v-ukraini">Наказ МОЗ України від 09.06.2022 № 994 «Про проведення тестової експлуатації телемедичних платформ (систем) в умовах воєнного стану в Україні»</a>
      
        3. <a href="https://moz.gov.ua/article/ministry-mandates/nakaz-moz-ukraini-vid-20062022--1062-pro-organizaciju-nadannja-medichnoi-dopomogi-iz-zastosuvannjam-telemedicini-v-umovah-voennogo-stanu">Наказ МОЗ України від 20.06.2022 № 1062 «Про організацію надання медичної допомоги із застосуванням телемедицини в умовах воєнного стану»</a>
        
        4. <a href="https://zakon.rada.gov.ua/laws/show/z1155-22#Text">Наказ МОЗ від 17.09.2022 № 1695 «Про затвердження Порядку надання медичної допомоги із застосуванням телемедицини, реабілітаційної допомоги із застосуванням телереабілітації на період дії воєнного стану в Україні або окремих її місцевостях»</a>
      
        5. <a href = "https://zakon.rada.gov.ua/laws/show/3301-20#Text">ЗАКОН УКРАЇНИ Про внесення змін до деяких законодавчих актів України щодо функціонування телемедицини</a>
        `;

    await bot.sendMessage(msg.chat.id, infoMessage, { parse_mode: "HTML" });
  }
  async function sendMessages(msg, text) {
    const linkToYoutube = ` 
          <b>Тут ви зможете знайти корисні для Вас відео</b>
          
          <a href="https://www.youtube.com/@serhii-qh4lw">Youtube канал RGS UKRAINE</a>`;
    await bot.sendMessage(msg.chat.id, linkToYoutube, { parse_mode: "HTML" });
  }

  async function sendMasterClassesList(msg, text) {
    await bot.sendMessage(
      msg.chat.id,
      `<b>Розклад майстер-класів</b>

- Четвер, 7 березня⋅16:00 – 17:30
- Четвер, 21 березня⋅16:00 – 17:30
- Четвер, 4 квітня⋅16:00 – 17:30 
<a href="https://meet.google.com/urx-xaoo-azg">Посилання на відеодзвінок</a>\n
- Четвер, 18 квітня⋅16:00 – 17:30
<a href="https://meet.google.com/urx-xaoo-azg">Посилання на відеодзвінок</a>\n
- Четвер, 2 травня⋅16:00 – 17:30
<a href="https://meet.google.com/urx-xaoo-azg">Посилання на відеодзвінок</a>\n
- Четвер, 16 травня⋅16:00 – 17:30
<a href="https://meet.google.com/urx-xaoo-azg">Посилання на відеодзвінок</a>\n
- Четвер, 30 травня⋅16:00 – 17:30
<a href="https://meet.google.com/urx-xaoo-azg">Посилання на відеодзвінок</a>\n
`, { parse_mode: "HTML" }
    );

    const linkToYoutube = ` 
          <b>За цим посиланням ви можете преглянути записи з майстер-класів</b>
          
          <a href="https://www.youtube.com/watch?v=8YBih1RpXuc&list=PLwhaTSFH9dx-gBnmy6S2u63sI4s21IB0q">Майстер-класи</a>`;
    await bot.sendMessage(msg.chat.id, linkToYoutube, { parse_mode: "HTML" });
  }

  async function sendSupportRequestMessage(msg) {
    const chatId = msg.chat.id;
    if (isFirstMenuCall) {
      bot.sendMessage(
        chatId,
        "Будь-ласка, вкажіть назву закладу або ЄДРПОУ закладу:",
        {
          force_reply: true,
        }
      );

      const hospitalResponse = await waitForReply(chatId);
      const hospitalName = hospitalResponse.text;

      bot.sendMessage(
        chatId,
        "Будь-ласка, вкажіть як до Вас звертатися (ПІБ):",
        {
          force_reply: true,
        }
      );

      const recipientResponse = await waitForReply(chatId);
      const recipientName = recipientResponse.text;

      await bot.sendMessage(
        msg.chat.id,
        "Будь-ласка, вкажіть ваш контактий номер телефону:",
        {
          force_reply: true,
          reply_markup: {
            keyboard: [
              [{ text: "Надати номер телефону", request_contact: true }],
            ],
            resize_keyboard: true,
            one_time_keyboard: true,
          },
        }
      );

      const contact = await waitForContact(chatId);

      // const recipientPhoneResponse = await waitForReply(chatId);
      const recipientPhone = contact.contact.phone_number;

      bot.sendMessage(chatId, "Будь-ласка, вкажіть адресу електронної пошти:", {
        force_reply: true,
      });

      const recipientEmailResponse = await waitForReply(chatId);
      const recipientEmail = recipientEmailResponse.text;

      bot.sendMessage(chatId, "Будь-ласка, детально опишіть проблему:", {
        force_reply: true,
      });

      const recipientProblemResponse = await waitForReply(chatId);
      const recipientProblem = recipientProblemResponse.text;

      const supportRequest = {
        hospital_name: hospitalName,
        recipient_name: recipientName,
        recipient_phone: recipientPhone,
        recipient_email: recipientEmail,
        problem: recipientProblem,
      };
      console.log(supportRequest);
      await insertSupportDocument(msg, supportRequest);
    }
  }

  async function insertSupportDocument(msg, document) {
    await bot.sendChatAction(msg.chat.id, "typing");
    try {
      const headers = {
        "Content-Type": "application/json", // Set the content type to JSON
        // Add any other headers as needed
      };
      const response = await axios.post(
        "https://new-rgs-bot-e6e357c7268f.herokuapp.com/api/support-request",
        document,
        { headers }
      );
      await sendSupportNotification(response.data);
      console.log("Response from Express.js:", response.data);
      bot.sendMessage(
        msg.chat.id,
        "Дякуємо за запит, ми зв'яжемося з Вами ближчим часом!"
      );
    } catch (error) {
      console.error("Error sending data to Express.js:", error);
    }
  }

  function waitForContact(chatId) {
    return new Promise((resolve) => {
      bot.once("contact", (contact) => {
        resolve(contact);
      });
    });
  }

  async function sendExercisesWithDiagnosis(msg, diagnosis) {
    for (const exercise of trainingEcercisesMobile) {
      if (exercise.diagnosis.includes(diagnosis)) {
        await bot.sendPhoto(msg.chat.id, exercise.img_url, {
          caption: `<b>Назва вправи:</b> ${exercise.name} \n\n <b>Опис:</b> ${exercise.description} \n\n <b>Когнітивна функція:</b> ${exercise.cognitive_function}`,
          parse_mode: "HTML",
        });
      }
    }
  }

  bot.on("text", async (msg) => {
    try {
      const userId = msg.chat.id;
      const commandName = msg.text;

      switch (msg.text) {
        case "/start":
          await bot.sendChatAction(msg.chat.id, "typing");
          await sendStartMessage(msg);
          break;
        case "/menu":
          await sendMainMenuMessage(msg);
          break;
        case "📝 Запит на навчання":
          await bot.sendChatAction(msg.chat.id, "typing");
          // await closeMenu(msg);
          await trainingRequest(msg);
          break;
        case "🆘 Запит технічної допомоги":
          await closeMenu(msg);
          await bot.sendChatAction(msg.chat.id, "typing");
          await sendSupportRequestMessage(msg);
          break;
        case "❌ Закрити меню":
          await closeMenu(msg);
          break;
        case "⬅️ Повернутися до головного меню":
          await sendMainMenuMessage(msg);
          break;
        case "☎️ Контакт служби підтримки":
          await bot.sendChatAction(msg.chat.id, "typing");
          await sendSupportContact(msg);
          break;
        case "📖 Інструкції":
          await sendInstructionsMenu(msg);
          break;
        case "🩺💻 Інструкція для кабінету лікаря":
          await sendDocument(msg, "./files/Doctors_cabinet_instruction.pdf");
          break;
        case "🧑🏻‍⚕️💻 Інструкція для кабінету пацієнта до пк":
          await sendDocument(msg, "./files/Patients_cabinet_web_manual.pdf");
          break;
        case "🧑🏻‍⚕️📱 Інструкція для пацієнта до мобільного пристрою":
          await sendDocument(msg, "./files/Patients_mobile_app_manual.pdf");
          break;
        case "⚡ Вправи":
          sendExercisesInfo(msg);
          break;
        case "Хвороба Альцгеймера":
          await bot.sendChatAction(msg.chat.id, "typing");
          await sendExercisesWithDiagnosis(msg, "Хвороба Альцгеймера");
          break;
        case "Атаксія":
          await bot.sendChatAction(msg.chat.id, "typing");
          await sendExercisesWithDiagnosis(msg, "Атаксія");
          break;
        case "Дитячий церебральний параліч":
          await bot.sendChatAction(msg.chat.id, "typing");
          await sendExercisesWithDiagnosis(msg, "Дитячий церебральний параліч");
          break;
        case "Розсіяний склероз":
          await bot.sendChatAction(msg.chat.id, "typing");
          await sendExercisesWithDiagnosis(msg, "Розсіяний склероз");
          break;
        case "Хвороба Паркінсона":
          await bot.sendChatAction(msg.chat.id, "typing");
          await sendExercisesWithDiagnosis(msg, "Хвороба Паркінсона");
          break;
        case "Інсульт":
          await bot.sendChatAction(msg.chat.id, "typing");
          await sendExercisesWithDiagnosis(msg, "Інсульт");
          break;
        case "Травма спинного мозку":
          await bot.sendChatAction(msg.chat.id, "typing");
          await sendExercisesWithDiagnosis(msg, "Травма спинного мозку");
          break;
        case "Черепно-мозкова травма":
          await bot.sendChatAction(msg.chat.id, "typing");
          await sendExercisesWithDiagnosis(msg, "Черепно-мозкова травма");
          break;
        case "ℹ️ Корисна інформація":
          await sendInfoMenu(msg);
          break;
        case "⚖️ Законодавство":
          await bot.sendChatAction(msg.chat.id, "typing");
          await sendUsefulInfoMessage(msg);
          break;
        case "▶️ Youtube канал":
          await bot.sendChatAction(msg.chat.id, "typing");
          await sendMessages(msg, "text");
          break;
        case "🎓 Майстер-класи":
          await bot.sendChatAction(msg.chat.id, "typing");
          await sendMasterClassesList(msg);
          break;
        default:
          // await bot.sendMessage(msg.chat.id, 'fsdfs');
          break;
      }
      await saveClickedButton(userId, commandName);
    } catch (error) {
      console.log(error);
    }
  });

  return bot;
};
