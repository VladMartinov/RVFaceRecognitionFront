<template>
  <div class="images">
    <div class="images-buttons">
      <BaseButton
        class="-secondary"
        v-if="currentUser.userRole !== UserRoleEnum.Observer"
        @onClick="callCreateImage"
      >
        Создать
      </BaseButton>
    </div>

    <table class="images-list" v-if="images.length > 0">
      <thead>
        <tr>
          <th>Изображение</th>
          <th>ФИО</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(image, index) in images.slice(
            bottomSliceIndex,
            topSliceIndex
          )"
          :key="index"
        >
          <td>
            <img :src="'data:image/jpeg;base64,' + image.photo" alt="Image" />
          </td>
          <td>
            {{ image.fullName }}
          </td>
          <td>
            <BaseButtonDropdown
              v-if="currentUser.userRole !== UserRoleEnum.Observer"
              :actions-list="imageActions"
              @selectAction="action($event, image)"
            />
          </td>
        </tr>
      </tbody>
    </table>

    <ul class="images-pagination" v-if="pageCount > 1">
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
      class="modal-image"
      :visible="modalImage"
      @closeModal="modalImage = !modalImage"
    >
      <template v-slot:header>
        <h5>{{ imageModal.title }}</h5>
      </template>

      <template v-slot:body>
        <div class="image">
          <div class="image-image">
            <img
              v-if="imageModal.image.photo && imageModal.image.photo !== null"
              :src="'data:image/jpeg;base64,' + imageModal.image.photo"
              alt="Image"
            />
            <div class="image-image__plug" v-else>
              <span>{{ $dictionary("noImageSelected") }}</span>
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

          <div class="image-group">
            <label for="full-name">ФИО</label>
            <BaseInput
              type="text"
              placeholder="ФИО"
              id="full-name"
              :modelValue="imageModal.image.fullName"
              @update:modelValue="imageModal.image.fullName = $event"
            />
          </div>
        </div>
      </template>

      <template v-slot:footer>
        <div class="modal-button-group">
          <BaseButton
            class="-primary -small"
            :disabled="isImageDataIncorrect"
            @click="createOrUpdateImage"
          >
            {{ imageModal.buttonText }}
          </BaseButton>
          <BaseButton class="-secondary -small" @click="modalImage = false">
            Закрыть
          </BaseButton>
        </div>
      </template>
    </BaseModal>

    <BaseModal
      class="modal-image-delete"
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
import { useRoute } from "vue-router";
import { useNotification } from "@kyvg/vue3-notification";

import { UserRoleEnum } from "@/utils/enums";
import _ from "lodash";

export default {
  name: "ImagesView",
  setup() {
    const store = useStore();
    const route = useRoute();
    const api = inject("$api");
    const { notify } = useNotification();

    let imageToAction = null;

    const modalImage = ref(false);
    const modalConfirm = reactive({
      isActive: false,
      title: "",
      desc: "",
      isDelete: false,
    });

    const imageModal = reactive({
      title: null,
      buttonText: null,
      isCreate: true,
      image: {
        imageId: null,
        fullName: null,
        photo: null,
      },
    });

    const currentUser = reactive(store.getters.currentUserInfo);

    const images = computed(() => store.getters.imagesInfo);

    const isImageDataIncorrect = computed(() => {
      return (
        _.isEmpty(imageModal.image.fullName) ||
        _.isEmpty(imageModal.image.photo)
      );
    });

    /* Pagination */
    const pageCount = computed(() => Math.ceil(images.getter().length / 10));
    const currentPage = ref(0);

    const bottomSliceIndex = ref(0);
    const topSliceIndex = ref(0);
    /* Pagination */

    const onChangeFile = function (event) {
      if (!event.target.files[0]) return;

      const fr = new FileReader();
      fr.onload = function () {
        imageModal.image.photo = fr.result.split(",")[1];
        console.log("Saved image: ", imageModal.image.photo);
      };
      fr.readAsDataURL(event.target.files[0]);
    };

    const imageActions = computed(() => {
      return [
        {
          text: "Обновить",
          type: "",
        },
        {
          text: "Удалить",
          type: "-danger",
        },
      ];
    });

    const action = function (index, image) {
      switch (index) {
        case 0:
          imageModal.image = {
            imageId: image.imageId,
            fullName: image.fullName,
            photo: image.photo,
          };
          imageModal.isCreate = false;

          imageModal.title = "Обновление изображения";
          imageModal.buttonText = "Обновить";

          modalImage.value = true;
          return;
        case 1:
          modalConfirm.isDelete = true;
          modalConfirm.title = "Удаление пользователя";
          modalConfirm.desc =
            "Вы уверены, что вы хотите удалить данного пользователя?";

          imageToAction = image;
          modalConfirm.isActive = true;
          return;
        default:
          return;
      }
    };

    const callCreateImage = function () {
      imageModal.title = "Создать изображение";
      imageModal.buttonText = "Создать";

      modalImage.value = true;
    };

    const createOrUpdateImage = function () {
      modalImage.value = false;

      const data = new FormData();
      data.append("FullName", imageModal.image.fullName);
      data.append("Photo", imageModal.image.photo);

      if (imageModal.isCreate) {
        api.image.createImage(data).then(() => {
          notify({
            title: "Создание изображения",
            text: "Новое изображение успешно было создано!",
            type: "success",
          });

          store.dispatch("fetchAllImages");
        });
      } else {
        api.image.updateImage(imageModal.image.imageId, data).then(() => {
          notify({
            title: "Обновление изображения",
            text: "Изображение было успешно обновлено!",
            type: "success",
          });

          store.dispatch("fetchAllImages");
        });
      }

      imageModal.title = null;
      imageModal.buttonText = null;
      imageModal.isCreate = true;
      imageModal.image = {
        imageId: null,
        fullName: null,
        photo: null,
      };
    };

    const modalConfirmAction = function () {
      modalConfirm.isActive = false;
      if (_.isNull(imageToAction)) return;

      api.image
        .deleteImage(imageToAction.imageId)
        .finally(() => {
          imageToAction = null;
        })
        .then(() => {
          notify({
            title: "Удаление изображения",
            text: "Изображение успешно было удалено!",
            type: "success",
          });

          store.dispatch("fetchAllImages");
        });
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
      await store.dispatch("fetchAllImages");
      selectPage(1);

      if (route.params.isCreate) {
        imageModal.image.photo = store.getters.getFaceToSave;
        store.dispatch("setFace", null);

        console.log("Mounted image: ", imageModal.image.photo);

        callCreateImage();
      }
    });

    return {
      images,
      imageActions,

      currentUser,
      UserRoleEnum,

      modalImage,
      modalConfirm,

      pageCount,
      currentPage,

      bottomSliceIndex,
      topSliceIndex,
      paginationValues,

      imageModal,
      isImageDataIncorrect,

      action,
      callCreateImage,
      onChangeFile,

      createOrUpdateImage,
      modalConfirmAction,

      selectPage,
    };
  },
};
</script>

<style lang="scss" scoped>
.images {
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
      width: 25%;
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

    & td:first-child img {
      margin-top: 15px;
      margin-bottom: 15px;

      width: 150px;
      height: 200px;

      border: 1px solid $primary-color;
      border-radius: 10px;

      box-shadow: 0 0 10px $primary-color;

      object-fit: cover;
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

  .modal-image {
    .image {
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

          text-align: center;
          font-size: 30px;
          color: $text-disabled-color;
        }
      }

      &-group {
        label {
          margin-left: 12px;
          margin-bottom: 5px;
        }

        &:not(:last-child) {
          margin-bottom: 15px;
        }
      }
    }
  }

  .modal-image,
  .modal-image-delete {
    .modal-button-group {
      display: flex;
      align-items: center;
      justify-content: flex-end;

      column-gap: 10px;
    }
  }
}
</style>
