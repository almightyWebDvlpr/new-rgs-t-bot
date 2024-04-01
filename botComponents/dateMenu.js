const generateMenuMarkup = (year, month) => {
    const daysInMonth = new Date(year, month, 0).getDate(); // Get the number of days in the specified month
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1); // Create an array of days in the month

    // Divide the days into rows of 7 buttons per row
    const rows = [];
    for (let i = 0; i < daysArray.length; i += 7) {
      rows.push(daysArray.slice(i, i + 7));
    }

    // Generate markup for each row of buttons
    const markupRows = rows.map((row) => {
      return row.map((day) => {
        return {
          text: day.toString(), // Button text is the day number
          callback_data: `select_date_${year}-${month
            .toString()
            .padStart(2, "0")}-${day.toString().padStart(2, "0")}`, // Callback data contains the selected date
        };
      });
    });

    // Generate buttons for navigation to previous and next months
    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;
    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;

    const prevMonthButton = {
      text: "◀️",
      callback_data: `navigate_month_${prevYear}-${prevMonth
        .toString()
        .padStart(2, "0")}`,
    };
    const nextMonthButton = {
      text: "▶️",
      callback_data: `navigate_month_${nextYear}-${nextMonth
        .toString()
        .padStart(2, "0")}`,
    };

    markupRows.push([prevMonthButton, nextMonthButton]);

    return markupRows; // Return the array of arrays representing rows of buttons
  };

  module.exports = {generateMenuMarkup};