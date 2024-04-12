<template>
  <div class="users">
    <div class="users-buttons">
      <BaseButton
        class="-secondary"
        v-if="currentUser.userRole !== UserRoleEnum.Observer"
        @onClick="callCreateUser"
      >
        Создать
      </BaseButton>
    </div>

    <table class="users-list" v-if="users.length > 0">
      <thead>
        <tr>
          <th>Фото</th>
          <th>ФИО</th>
          <th>Статус</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(user, index) in users.slice(bottomSliceIndex, topSliceIndex)"
          :key="index"
        >
          <td>
            <BaseUserPhoto :user="user" />
          </td>
          <td>
            {{ user.fullName }}
          </td>
          <td>
            {{ getCorrectStatus(user.userStatus) }}
          </td>
          <td>
            <BaseButtonDropdown
              v-if="currentUser.userRole !== UserRoleEnum.Observer"
              :actions-list="userActions(user)"
              @selectAction="action($event, user)"
            />
          </td>
        </tr>
      </tbody>
    </table>

    <ul class="users-pagination" v-if="pageCount > 1">
      <li>
        <BaseButton
          class="-secondary -small"
          :disabled="currentPage - 1 < 1"
          @onClick="selectPage(currentPage - 1)"
        >
          &laquo;
        </BaseButton>
      </li>
      <li v-for="value in paginationValues" :key="value">
        <BaseButton
          class="-secondary -small"
          :class="{ '-active': value === currentPage }"
          :disabled="value === null"
          @onClick="selectPage(value)"
        >
          {{ value === null ? "..." : value }}
        </BaseButton>
      </li>
      <li>
        <BaseButton
          class="-secondary -small"
          :disabled="currentPage + 1 > pageCount"
          @onClick="selectPage(currentPage + 1)"
        >
          &raquo;
        </BaseButton>
      </li>
    </ul>

    <BaseModal
      class="modal-user"
      :visible="modalUser"
      @closeModal="modalUser = !modalUser"
    >
      <template v-slot:header>
        <h5>{{ userModal.title }}</h5>
      </template>

      <template v-slot:body>
        <div class="user">
          <div class="user-image">
            <img
              v-if="userModal.user.photo && userModal.user.photo !== null"
              :src="'data:image/jpeg;base64,' + userModal.user.photo"
              alt="User image"
            />
            <div class="user-image__plug" v-else>
              <span>{{ userImageText }}</span>
            </div>

            <input
              type="file"
              ref="file"
              accept=".jpg,.jpeg,.png"
              @change="onChangeFile"
            />

            <BaseButton
              class="-secondary -full-width"
              @onClick="$refs.file.click()"
            >
              Выбрать изображение
            </BaseButton>
          </div>

          <div class="user-group">
            <label for="full-name">ФИО</label>
            <BaseInput
              type="text"
              placeholder="ФИО"
              id="full-name"
              :modelValue="userModal.user.fullName"
              @update:modelValue="userModal.user.fullName = $event"
            />
          </div>

          <div class="user-group -radio">
            <label>Роль</label>

            <div class="user-group-list">
              <div>
                <input
                  type="radio"
                  id="default"
                  name="role"
                  :value="UserRoleEnum.User"
                  v-model="userModal.user.userRole"
                />
                <label for="default">Обычный</label>
              </div>

              <div>
                <input
                  type="radio"
                  id="observer"
                  name="role"
                  :value="UserRoleEnum.Observer"
                  v-model="userModal.user.userRole"
                />
                <label for="observer">Наблюдатель</label>
              </div>

              <div>
                <input
                  type="radio"
                  id="admin"
                  name="role"
                  :value="UserRoleEnum.Admin"
                  v-model="userModal.user.userRole"
                />
                <label for="admin">Администратор</label>
              </div>
            </div>
          </div>

          <div class="user-group">
            <label for="login">{{ $dictionary("login") }}</label>
            <BaseInput
              type="text"
              placeholder="login123"
              id="login"
              :disabled="!userModal.isCreate"
              :modelValue="userModal.user.login"
              @update:modelValue="userModal.user.login = $event"
            />
          </div>

          <div class="user-group">
            <label for="password">{{ $dictionary("password") }}</label>
            <BaseInput
              type="password"
              placeholder="pass123"
              id="password"
              :modelValue="userModal.user.password"
              @update:modelValue="userModal.user.password = $event"
            />
          </div>

          <div class="user-group">
            <label for="confirm-password">
              {{ $dictionary("confirmPassword") }}
            </label>
            <BaseInput
              type="password"
              placeholder="pass123"
              id="confirm-password"
              :modelValue="userModal.user.confirmPassword"
              @update:modelValue="userModal.user.confirmPassword = $event"
            />
          </div>
        </div>
      </template>

      <template v-slot:footer>
        <div class="modal-button-group">
          <BaseButton
            class="-primary -small"
            :disabled="isUserDataIncorrect"
            @click="createOrUpdateUser"
          >
            {{ userModal.buttonText }}
          </BaseButton>
          <BaseButton class="-secondary -small" @click="modalUser = false">
            Закрыть
          </BaseButton>
        </div>
      </template>
    </BaseModal>

    <BaseModal
      class="modal-user-delete"
      :visible="modalConfirm.isActive"
      @closeModal="modalConfirm.isActive = !modalConfirm.isActive"
    >
      <template v-slot:header>
        <h5>{{ modalConfirm.title }}</h5>
      </template>

      <template v-slot:body>
        <p>{{ modalConfirm.desc }}</p>
      </template>

      <template v-slot:footer>
        <div class="modal-button-group">
          <BaseButton class="-primary -small" @click="modalConfirmAction">
            OK
          </BaseButton>
          <BaseButton
            class="-secondary -small"
            @click="modalConfirm.isActive = false"
          >
            Закрыть
          </BaseButton>
        </div>
      </template>
    </BaseModal>
  </div>
</template>

<script>
import { ref, computed, onMounted, inject, reactive } from "vue";
import { useStore } from "vuex";
import { useNotification } from "@kyvg/vue3-notification";

import { UserRoleEnum, UserStatusEnum } from "@/utils/enums";
import _ from "lodash";

export default {
  name: "UsersView",
  setup() {
    const store = useStore();
    const dictionary = inject("$dictionary");
    const api = inject("$api");
    const { notify } = useNotification();

    let userToAction = null;

    const modalUser = ref(false);
    const modalConfirm = reactive({
      isActive: false,
      title: "",
      desc: "",
      isDelete: false,
    });

    const userModal = reactive({
      title: null,
      buttonText: null,
      isCreate: true,
      user: {
        userId: null,
        userRole: UserRoleEnum.User,
        userStatus: UserStatusEnum.Active,
        fullName: null,
        photo: null,
        login: null,
        password: "",
        confirmPassword: "",
      },
    });

    const currentUser = reactive(store.getters.currentUserInfo);

    const users = computed(() => {
      return _.filter(
        store.getters.usersInfo,
        (user) => user.userStatus !== UserStatusEnum.Removed
      );
    });

    const userImageText = computed(() => {
      if (_.isEmpty(userModal.user.fullName)) return "";

      const initials = userModal.user.fullName
        .split(" ")
        .map((name) => name.charAt(0).toUpperCase())
        .join("")
        .slice(0, 3);

      return initials;
    });

    const isUserDataIncorrect = computed(() => {
      return (
        _.isEmpty(userModal.user.fullName) ||
        _.isEmpty(userModal.user.login) ||
        userModal.user.password !== userModal.user.confirmPassword ||
        (userModal.isCreate && _.isEmpty(userModal.user.password))
      );
    });

    /* Pagination */
    const pageCount = computed(() => Math.ceil(users.getter().length / 10));
    const currentPage = ref(0);

    const bottomSliceIndex = ref(0);
    const topSliceIndex = ref(0);
    /* Pagination */

    const onChangeFile = function (event) {
      if (!event.target.files[0]) return;

      const fr = new FileReader();
      fr.onload = function () {
        userModal.user.photo = fr.result.split(",")[1];
      };
      fr.readAsDataURL(event.target.files[0]);
    };

    const userActions = function (user) {
      return [
        {
          text: "Обновить",
          type: "",
        },
        {
          text:
            user.userStatus === UserStatusEnum.Blocked
              ? "Разблокировать"
              : "Заблокировать",
        },
        {
          text: "Удалить",
          type: "-danger",
        },
      ];
    };

    const action = function (index, user) {
      switch (index) {
        case 0:
          userModal.user = {
            userId: user.userId,
            userRole: user.userRole,
            userStatus: user.userStatus,
            fullName: user.fullName,
            photo: user.photo,
            login: user.login,
            password: "",
            confirmPassword: "",
          };
          userModal.isCreate = false;

          userModal.title = "Обновление пользователя";
          userModal.buttonText = "Обновить";

          modalUser.value = true;
          return;
        case 1:
          modalConfirm.title = "Обновление статуса";
          modalConfirm.desc =
            user.userStatus === UserStatusEnum.Blocked
              ? `Вы уверены, что хотите разблокировать пользователя ${user.fullName}`
              : `Вы уверены, что хотите заблокировать пользователя ${user.fullName}`;

          userToAction = user;
          modalConfirm.isActive = true;

          return;
        case 2:
          modalConfirm.isDelete = true;
          modalConfirm.title = "Удаление пользователя";
          modalConfirm.desc =
            "Вы уверены, что вы хотите удалить данного пользователя?";

          userToAction = user;
          modalConfirm.isActive = true;
          return;
        default:
          return;
      }
    };

    const callCreateUser = function () {
      userModal.title = "Создать пользователя";
      userModal.buttonText = "Создать";

      modalUser.value = true;
    };

    const getCorrectStatus = function (status) {
      switch (status) {
        case UserStatusEnum.Active:
          return dictionary("userStatusActive");
        case UserStatusEnum.Blocked:
          return dictionary("userStatusBlocked");
        case UserStatusEnum.Removed:
          return dictionary("userStatusRemoved");
      }
    };

    const createOrUpdateUser = function () {
      modalUser.value = false;

      const data = new FormData();
      data.append("UserRole", userModal.user.userRole);
      data.append("UserStatus", userModal.user.userStatus);
      data.append("FullName", userModal.user.fullName);
      if (userModal.user.photo !== null)
        data.append("Photo", userModal.user.photo);
      data.append("Login", userModal.user.login);
      data.append("Password", userModal.user.password);

      if (userModal.isCreate) {
        api.user.createUser(data).then(() => {
          notify({
            title: "Создание пользователя",
            text: "Новый пользователь успешно был создан!",
            type: "success",
          });

          store.dispatch("fetchAllUsers");
        });
      } else {
        api.user.updateUser(userModal.user.userId, data).then(() => {
          notify({
            title: "Обновление пользователя",
            text: "Пользователь был успешно обновлён!",
            type: "success",
          });

          store.dispatch("fetchAllUsers");
        });
      }

      userModal.title = null;
      userModal.buttonText = null;
      userModal.isCreate = true;
      userModal.user = {
        userId: null,
        userRole: UserRoleEnum.User,
        userStatus: UserStatusEnum.Active,
        fullName: null,
        photo: null,
        login: null,
        password: "",
        confirmPassword: "",
      };
    };

    const modalConfirmAction = function () {
      modalConfirm.isActive = false;
      if (_.isNull(userToAction)) return;

      if (modalConfirm.isDelete) {
        api.user
          .deleteUser(userToAction.userId)
          .finally(() => {
            userToAction = null;
          })
          .then(() => {
            notify({
              title: "Удаление пользователя",
              text: "Пользователь успешно был удалён!",
              type: "success",
            });

            store.dispatch("fetchAllUsers");
          });
      } else {
        api.user
          .updateUserStatus(
            userToAction.userId,
            userToAction.userStatus === UserStatusEnum.Blocked
              ? UserStatusEnum.Active
              : UserStatusEnum.Blocked
          )
          .finally(() => {
            userToAction = null;
          })
          .then(() => {
            notify({
              title: "Обновление статуса",
              text: "Статус пользователя был успешно обновлён!",
              type: "success",
            });

            store.dispatch("fetchAllUsers");
          });
      }
    };

    const selectPage = function (page) {
      currentPage.value = page;

      bottomSliceIndex.value = (currentPage.value - 1) * 10;
      topSliceIndex.value = currentPage.value * 10;
    };

    const paginationValues = computed(() => {
      if (pageCount.getter() < 7)
        return Array(pageCount.getter())
          .fill()
          .map((_, i) => i + 1);
      if (currentPage.value >= 1 && currentPage.value <= 3)
        return [1, 2, 3, 4, null, pageCount.getter()];
      if (
        currentPage.value <= pageCount.getter() &&
        currentPage.value >= pageCount.getter() - 2
      )
        return [
          1,
          null,
          pageCount.getter() - 3,
          pageCount.getter() - 2,
          pageCount.getter() - 1,
          pageCount.getter(),
        ];

      return [
        1,
        null,
        currentPage.value - 1,
        currentPage.value,
        currentPage.value + 1,
        null,
        pageCount.getter(),
      ];
    });

    onMounted(async () => {
      await store.dispatch("fetchAllUsers");
      selectPage(1);
    });

    return {
      users,
      userActions,

      currentUser,

      modalUser,
      modalConfirm,

      pageCount,
      currentPage,

      bottomSliceIndex,
      topSliceIndex,
      paginationValues,

      userModal,
      userImageText,
      isUserDataIncorrect,

      UserRoleEnum,

      getCorrectStatus,
      action,
      callCreateUser,
      onChangeFile,

      createOrUpdateUser,
      modalConfirmAction,

      selectPage,
    };
  },
};
</script>

<style lang="scss" scoped>
.users {
  padding: 20px 50px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  height: 100vh;

  &-buttons {
    display: flex;
    align-items: center;
    justify-content: flex-end;

    width: 100%;

    & > *:not(:last-child) {
      margin-right: 10px;
    }
  }

  &-list {
    width: 100%;

    border: 1px solid $primary-color;
    border-left: 0;
    border-right: 0;

    & th {
      padding: 15px 0;
    }

    & th:first-child,
    & td:first-child {
      width: 10%;
    }

    & td:first-child > *,
    & td:last-child > * {
      margin-right: auto;
      margin-left: auto;
    }

    & th:last-child,
    & td:last-child {
      width: 15%;
    }

    & td:last-child > * {
      display: none;
    }

    & tbody tr:hover td:last-child > * {
      display: block;
    }
  }

  &-pagination {
    display: flex;
    align-self: start;

    & > *:not(:last-child) {
      margin-right: 5px;
    }
  }

  & > *:not(:last-child) {
    margin-bottom: 25px;
  }

  .modal-user {
    .user {
      &-image {
        margin-bottom: 15px;

        input {
          display: none;
        }

        img,
        &__plug {
          margin: 0 auto 10px;

          width: 250px;
          height: 250px;

          background-color: #dcdcde;
          border: 1px solid $primary-color;
          border-radius: 10px;
        }

        img {
          object-fit: cover;
        }

        &__plug {
          display: flex;
          align-items: center;
          justify-content: center;

          font-size: 30px;
          color: $text-disabled-color;
        }
      }

      &-group {
        label {
          margin-left: 12px;
          margin-bottom: 5px;
        }

        &-list {
          margin: 0 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        &:not(:last-child) {
          margin-bottom: 15px;
        }
      }
    }
  }

  .modal-user,
  .modal-user-delete {
    .modal-button-group {
      display: flex;
      align-items: center;
      justify-content: flex-end;

      column-gap: 10px;
    }
  }
}
</style>
