<template>
  <div class="cameras">
    <div class="cameras-tools">
      <BaseButton
        class="-secondary -super-small"
        v-if="currentUser.userRole !== UserRoleEnum.Observer"
        :disabled="!websocket.core || saveImageStarted"
        @onClick="saveImage"
      >
        Сохранить изображение
      </BaseButton>

      <BaseButton class="-secondary -super-small" @onClick="startStream">
        Начать поток
      </BaseButton>

      <BaseButton class="-secondary -super-small" @onClick="endStream">
        Остановить поток
      </BaseButton>
      <!--<BaseButton class="-secondary -super-small">Добавить +</BaseButton>-->
    </div>

    <div class="cameras-image">
      <canvas ref="frame"></canvas>

      <div class="cameras-statuses-wrapper" v-if="isNeedStatuses">
        <ul class="cameras-statuses">
          <li
            class="cameras-statuses__item"
            v-for="(action, index) in actionsList"
            :key="index"
          >
            <span
              class="cameras-statuses__item-indicator"
              :class="getStatusClass(action.status)"
            ></span>
            <span v-if="actionsAsideState" class="cameras-statuses__item-desc">
              {{ action.desc }}
            </span>
            <div
              v-if="
                actionsAsideState &&
                action.status !== CamerasActionsStatusEnum.Disabled
              "
              class="cameras-statuses__item-btn"
              :class="getStatusClass(action.status)"
              @click="action.function"
            >
              <span>{{ action.btnText }}</span>
              <BaseIcon name="gear" size="16px" />
            </div>
          </li>
        </ul>

        <BaseIcon
          :class="{ '-active': actionsAsideState }"
          name="drop-down"
          size="20px"
          @click="changeAsideInfoState"
        />
      </div>

      <div class="cameras-empty" v-if="!websocket.core">
        <span>{{ $dictionary("noCameraSelected") }}</span>
      </div>

      <div class="cameras-fps" v-if="websocket.core">
        <span>{{ "fps: " + fpsToView }}</span>
      </div>
    </div>

    <div
      class="cameras-list-wrapper"
      :class="{ '-hidden': !camerasListState }"
      v-if="isNeedCamerasList"
    >
      <BaseIcon
        :class="{ '-active': camerasListState }"
        name="drop-down"
        size="20px"
        @click="changeCamerasListState"
      />

      <div class="cameras-list__buttons" v-if="camerasListState">
        <BaseButton class="-secondary -super-small">Удалить</BaseButton>
      </div>

      <ul class="cameras-list" v-if="camerasListState">
        <li class="cameras-list__item">
          <img
            src="https://tipik.ru/wp-content/uploads/2019/06/Пума-скачать-картинки003.jpg"
            alt="Camera Image"
          />
        </li>
        <li class="cameras-list__item -add">
          <button>Add +</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onUnmounted, inject } from "vue";
import { useNotification } from "@kyvg/vue3-notification";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

import { UserRoleEnum } from "@/utils/enums";
import _ from "lodash";

export default {
  name: "CamerasView",
  setup() {
    /*
    const actionsAsideState = ref(false);
    const camerasListState = ref(false);
    */
    const api = inject("$api");
    const store = useStore();
    const router = useRouter();
    const { notify } = useNotification();

    const currentUser = reactive(store.getters.currentUserInfo);

    const frame = ref(null);
    const fps = ref(0);
    const fpsToView = ref(0);

    const saveImageStarted = ref(false);

    const websocket = reactive({
      core: null,
      fpsUpdate: null,
    });
    //let websocket = new WebSocket("wss://localhost:7019/api/cameras/frames");

    /*
    const actionsList = reactive([
      {
        desc: "Активация камер",
        btnText: "Выполнить",
        status: CamerasActionsStatusEnum.Default,
        function: () => {
          actionsList[0].status = CamerasActionsStatusEnum.Success;
          actionsList[1].status = CamerasActionsStatusEnum.Default;
          console.log("I'm activating all cameras!");
        },
      },
      {
        desc: "Распознавание лиц",
        btnText: "Выполнить",
        status: CamerasActionsStatusEnum.Disabled,
        function: () => {
          actionsList[1].status = CamerasActionsStatusEnum.Success;
          actionsList[2].status = CamerasActionsStatusEnum.Default;
          console.log("I'm start recognizing faces!");
        },
      },
      {
        desc: "Обучение модели",
        btnText: "Выполнить",
        status: CamerasActionsStatusEnum.Disabled,
        function: () => {
          actionsList[2].status = CamerasActionsStatusEnum.Success;
          actionsList[3].status = CamerasActionsStatusEnum.Default;
          console.log("I'm teach the model!");
        },
      },
      {
        desc: "Сравнение лиц",
        btnText: "Выполнить",
        status: CamerasActionsStatusEnum.Disabled,
        function: () => {
          actionsList[3].status = CamerasActionsStatusEnum.Success;
          console.log("I'm compair faces!");
        },
      },
    ]);
    */

    const isNeedStatuses = computed(() => {
      return false;
    });

    const isNeedCamerasList = computed(() => {
      return false;
    });

    /*
    const getStatusClass = function (status) {
      switch (status) {
        case CamerasActionsStatusEnum.Active:
          return "-active";
        case CamerasActionsStatusEnum.Success:
          return "-success";
        case CamerasActionsStatusEnum.Warn:
          return "-warn";
        case CamerasActionsStatusEnum.Error:
          return "-error";
        case CamerasActionsStatusEnum.Disabled:
          return "-disabled";
        default:
          return "";
      }
    };

    const changeAsideInfoState = function () {
      actionsAsideState.value = !actionsAsideState.value;
    };

    const changeCamerasListState = function () {
      camerasListState.value = !camerasListState.value;
    };
    */

    const startStream = function () {
      if (!_.isNull(websocket.core)) return;

      websocket.core = new WebSocket("wss://localhost:7019/");
      websocket.fpsUpdate = setInterval(() => {
        fpsToView.value = fps.value;
        fps.value = 0;
      }, 1000);

      websocket.core.onmessage = (event) => {
        if (event.data instanceof Blob) {
          fps.value++;

          const blob = event.data;
          const image = new Image();

          if (_.isUndefined(frame.value)) return;

          const ctx = frame.value.getContext("2d");

          const reader = new FileReader();
          reader.onload = () => {
            image.onload = () => {
              ctx.drawImage(image, 0, 0, frame.value.width, frame.value.height);
            };
            image.src = reader.result;
          };
          reader.readAsDataURL(blob);
        }
      };
    };

    const endStream = function () {
      if (_.isNull(websocket.core)) return;

      if (!_.isUndefined(frame.value)) {
        const ctx = frame.value.getContext("2d");
        ctx.clearRect(0, 0, frame.value.width, frame.value.height);
      }

      websocket.core.close();
      websocket.core = null;

      clearInterval(websocket.fpsUpdate);
      websocket.fpsUpdate = null;
    };

    const saveImage = function () {
      saveImageStarted.value = true;

      api.cameras
        .getFace()
        .then(async ({ data }) => {
          await store.dispatch("setFace", data);

          if (!_.isNull(websocket.core)) {
            websocket.core.close();
            websocket.core = null;
            clearInterval(websocket.fpsUpdate);
            websocket.fpsUpdate = null;
          }

          router.push(`/images/${true}`);
        })
        .catch((error) => {
          if (error.status === 404) {
            notify({
              title: "Сохранение лица",
              text: "Лицо не было обнаружено, попробуйте еще раз.",
              type: "error",
            });
          }
        })
        .finally(() => {
          saveImageStarted.value = false;
        });
    };

    onUnmounted(() => {
      if (_.isNull(websocket.core)) return;

      websocket.core.close();
      websocket.core = null;

      clearInterval(websocket.fpsUpdate);
      websocket.fpsUpdate = null;
    });

    return {
      // actionsAsideState,
      // actionsList,
      // CamerasActionsStatusEnum,
      // getStatusClass,
      // changeAsideInfoState,

      websocket,

      currentUser,
      UserRoleEnum,

      frame,
      fpsToView,

      saveImageStarted,

      isNeedStatuses,
      isNeedCamerasList,

      saveImage,

      startStream,
      endStream,

      // camerasListState,
      // changeCamerasListState,
    };
  },
};
</script>

<style lang="scss" scoped>
.cameras {
  position: relative;

  display: flex;
  flex-direction: column;

  padding: 20px 50px 50px;

  height: 100vh;

  &-tools {
    margin-bottom: 5px;

    display: flex;
    align-items: center;
    justify-content: flex-end;

    column-gap: 10px;
  }

  &-image {
    position: relative;
    flex-grow: 1;

    & canvas {
      width: 100%;
      height: 100%;

      background-color: $black;
    }

    .cameras-statuses-wrapper {
      position: absolute;

      display: flex;
      align-items: center;
      justify-content: space-between;

      padding: 15px 5px 15px 10px;

      top: 110px;
      left: -25px;

      background-color: rgba($primary-hover-color, 0.5);
      border-top-right-radius: 15px;
      border-bottom-right-radius: 15px;

      .icon {
        transform: rotate(-90deg);
        cursor: pointer;

        &.-active {
          transform: rotate(90deg);
        }
      }
    }

    .cameras-statuses {
      display: flex;
      flex-direction: column;

      row-gap: 8px;

      &__item {
        display: flex;
        align-items: center;

        min-height: 24px;

        &-indicator {
          width: 5px;
          height: 5px;

          background-color: $white;
          border-radius: 50%;

          -webkit-box-shadow: 0px 0px 5px 5px rgba($white, 0.25);
          -moz-box-shadow: 0px 0px 5px 5px rgba($white, 0.25);
          box-shadow: 0px 0px 5px 5px rgba($white, 0.25);

          &:not(:last-child) {
            margin-right: 20px;
          }

          &.-active {
            background-color: $primary-color;

            -webkit-box-shadow: 0px 0px 5px 5px rgba($primary-color, 0.25);
            -moz-box-shadow: 0px 0px 5px 5px rgba($primary-color, 0.25);
            box-shadow: 0px 0px 5px 5px rgba($primary-color, 0.25);
          }

          &.-success {
            background-color: $success-color;

            -webkit-box-shadow: 0px 0px 5px 5px rgba($success-color, 0.25);
            -moz-box-shadow: 0px 0px 5px 5px rgba($success-color, 0.25);
            box-shadow: 0px 0px 5px 5px rgba($success-color, 0.25);
          }

          &.-warn {
            background-color: $warn-color;

            -webkit-box-shadow: 0px 0px 5px 5px rgba($warn-color, 0.25);
            -moz-box-shadow: 0px 0px 5px 5px rgba($warn-color, 0.25);
            box-shadow: 0px 0px 5px 5px rgba($warn-color, 0.25);
          }

          &.-error {
            background-color: $error-color;

            -webkit-box-shadow: 0px 0px 5px 5px rgba($error-color, 0.25);
            -moz-box-shadow: 0px 0px 5px 5px rgba($error-color, 0.25);
            box-shadow: 0px 0px 5px 5px rgba($error-color, 0.25);
          }

          &.-disabled {
            background-color: $text-disabled-color;

            -webkit-box-shadow: 0px 0px 5px 5px transparent;
            -moz-box-shadow: 0px 0px 5px 5px transparent;
            box-shadow: 0px 0px 5px 5px transparent;
          }
        }

        &-desc {
          min-width: 140px;

          font-size: 14px;
          color: $text-color;
          text-align: left;

          &:not(:last-child) {
            margin-right: 15px;
          }
        }

        &-btn {
          display: flex;
          align-items: center;
          justify-content: space-between;

          padding: 2px 6px;

          min-width: 95px;

          border: 1px solid #ffffff;
          border-radius: 5px;

          cursor: pointer;

          & span {
            font-size: 12px;
          }

          &:hover {
            background-color: rgba($primary-color, 0.5);
          }

          &:active {
            background-color: rgba($primary-color, 0.65);
          }

          &.-active {
            border-color: $primary-color;

            .icon {
              color: $primary-color;
              animation: $rotate;
            }
          }

          &.-success {
            border-color: $success-color;

            .icon {
              color: $success-color;
            }
          }

          &.-warn {
            border-color: $warn-color;

            .icon {
              color: $warn-color;
            }
          }

          &.-error {
            border-color: $error-color;

            .icon {
              color: $error-color;
            }
          }
        }
      }

      &:not(:last-child) {
        margin-right: 15px;
      }
    }

    .cameras-empty {
      position: absolute;

      top: 50%;
      left: 50%;

      flex-shrink: 0;

      font-size: 36px;
      font-weight: 400;
      color: $text-disabled-color;

      transform: translate(-50%, -50%);
    }

    .cameras-fps {
      position: absolute;

      right: 20px;
      top: 20px;

      padding: 2px 5px;

      min-width: 50px;

      font-size: 12px;
      color: $text-color;

      border: 1px solid rgba($white, 0.5);
      border-radius: 10px;

      background-color: rgba($primary-color, 0.5);
    }
  }

  &-list-wrapper {
    position: absolute;

    display: flex;
    flex-direction: column;
    align-items: center;

    padding: 5px 20px 15px;

    bottom: 0;
    left: 0;
    right: 0;

    background-color: rgba($primary-hover-color, 0.5);
    border-top: 1px solid $black;
    border-top-right-radius: 15px;
    border-top-left-radius: 15px;

    & .icon {
      transform: scaleY(-1);
      cursor: pointer;

      &.-active {
        transform: scaleY(1);
      }

      &:not(:last-child) {
        margin-bottom: 5px 0;
      }
    }

    .cameras-list__buttons {
      position: absolute;

      right: 20px;
      top: 5px;
    }

    .cameras-list {
      display: flex;
      align-items: flex-start;

      column-gap: 28px;
      width: 100%;

      &__item {
        width: 70px;
        height: 70px;

        border-radius: 5px;

        img {
          width: 100%;
          height: 100%;

          object-fit: cover;
          filter: blur(5px);
        }

        &.-add button {
          width: 100%;
          height: 100%;

          font-size: 14px;
          font-weight: 400;
          color: $text-color;

          background-color: transparent;
          border: 2px dashed $white;
          border-radius: 5px;

          filter: none;

          -webkit-box-shadow: 0px 0px 10px 5px rgba($white, 0.25);
          -moz-box-shadow: 0px 0px 10px 5px rgba($white, 0.25);
          box-shadow: 0px 0px 10px 5px rgba($white, 0.25);

          &:hover {
            background-color: rgba($primary-color, 0.25);
          }

          &:active {
            background-color: rgba($primary-color, 0.35);
          }
        }
      }
    }

    &.-hidden {
      padding: 5px 20px;
    }
  }
}
</style>
