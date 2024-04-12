export default {
  install(app) {
    const dictionaryFunction = function () {
      function languagePicker(phrase) {
        const ruDictionary = {
          now: "Сейчас",
          login: "Логин",
          password: "Пароль",
          confirmPassword: "Подтвердите пароль",
          forgotPassword: "Забыли пароль?",
          logIn: "Войти",
          importantFieldIsEmpty: "Необходимо заполнить данное поле.",

          loginRecoveryTitle: "Поиск вашего логина",
          loginRecoveryDesc: "Введите ваш логин в поле ниже",
          loginRecoveryError: "Указанный пользователь не был найден",

          passwordRecoveryTitle: "Новый пароль",
          passwordRecoveryDesc: "В полях ниже дважды введите новый пароль",
          passwordRecoveryError:
            "Этот пароль слишком слаб, либо содержит недопустимые символы (минимальная длинна пароля 6, максимальная 155)",
          confirmPasswordRecoveryError:
            "Пароль подтверждения не совпадает с паролем указанным выше",

          goBack: "Вернуться назад",

          next: "Далее",
          update: "Обновить",
          exit: "Выйти",

          cameras: "Камеры",
          images: "Изображения",
          users: "Пользователи",
          activityLog: "Журнал",

          noCameraSelected: "Ни одна камера не выбрана",

          userStatusActive: "Активный",
          userStatusBlocked: "Заблокирован",
          userStatusRemoved: "Удалён",

          noImageSelected: "Изображение не выбрано",
        };

        const enDictionary = {
          now: "Now",
          login: "Login",
          password: "Password",
          confirmPassword: "Confirm password",
          forgotPassword: "Forgot your password?",
          logIn: "Log In",
          importantFieldIsEmpty: "This field must be filled in.",

          loginRecoveryTitle: "Finding your login",
          loginRecoveryDesc: "Enter your login in the field below",
          loginRecoveryError: "The specified user was not found",

          passwordRecoveryTitle: "New password",
          passwordRecoveryDesc:
            "In the fields below, enter the new password twice",
          passwordRecoveryError:
            "This password is too weak or contains invalid characters (minimum password length 6, maximum 155)",
          confirmPasswordRecoveryError:
            "The confirmation password does not match the password above",

          goBack: "Go back",

          next: "Next",
          update: "Update",
          exit: "Exit",

          cameras: "Cameras",
          images: "Images",
          users: "Users",
          activityLog: "Activity log",

          noCameraSelected: "No camera selected",

          userStatusActive: "Active",
          userStatusBlocked: "Blocked",
          userStatusRemoved: "Removed",

          noImageSelected: "Image not selected",
        };

        return localStorage.getItem("lang") === "ru" && enDictionary
          ? ruDictionary[phrase]
          : ruDictionary[phrase];
      }

      return languagePicker;
    };

    // Для Options API
    app.config.globalProperties.$dictionary = dictionaryFunction();

    // Для Composition API
    app.provide("$dictionary", dictionaryFunction());
  },
};
