<template>
  <div class="logs">
    <table class="logs-list" v-if="logs.length > 0">
      <thead>
        <tr>
          <th>Дата</th>
          <th @click="isTypeActionTitleAsc = !isTypeActionTitleAsc">
            <span>
              Тип действия {{ isTypeActionTitleAsc ? "&#x25B2;" : "&#x25BC;" }}
            </span>
          </th>
          <th @click="isUserFullNameAsc = !isUserFullNameAsc">
            <span>
              Совершивший пользователь
              {{ isUserFullNameAsc ? "&#x25B2;" : "&#x25BC;" }}
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(log, index) in logs.slice(bottomSliceIndex, topSliceIndex)"
          :key="index"
        >
          <td>
            {{ formattedDate(log.dateAction) }}
          </td>
          <td>
            {{ log.typeActionTitle }}
          </td>
          <td>
            {{ log.userFullName }}
          </td>
        </tr>
      </tbody>
    </table>

    <ul class="logs-pagination" v-if="pageCount > 1">
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
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";

import _ from "lodash";

export default {
  name: "ActivityLogView",
  setup() {
    const store = useStore();

    const isTypeActionTitleAsc = ref(false);
    const isUserFullNameAsc = ref(false);

    const logs = computed(() => {
      return _.sortBy(store.getters.logsInfo, [
        isTypeActionTitleAsc.value && "typeActionTitle",
        isUserFullNameAsc.value && "userFullName",
      ]);
    });

    /* Pagination */
    const pageCount = computed(() => Math.ceil(logs.getter().length / 20));
    const currentPage = ref(0);

    const bottomSliceIndex = ref(0);
    const topSliceIndex = ref(0);
    /* Pagination */

    function padTo2Digits(num) {
      return num.toString().padStart(2, "0");
    }

    const formattedDate = function (dateString) {
      const date = new Date(dateString);

      return (
        [
          date.getFullYear(),
          padTo2Digits(date.getMonth() + 1),
          padTo2Digits(date.getDate()),
        ].join("-") +
        " " +
        [
          padTo2Digits(date.getHours()),
          padTo2Digits(date.getMinutes()),
          padTo2Digits(date.getSeconds()),
        ].join(":")
      );
    };

    const selectPage = function (page) {
      currentPage.value = page;

      bottomSliceIndex.value = (currentPage.value - 1) * 20;
      topSliceIndex.value = currentPage.value * 20;
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
      await store.dispatch("fetchAllLogs");
      selectPage(1);
    });

    return {
      isTypeActionTitleAsc,
      isUserFullNameAsc,

      logs,
      formattedDate,

      pageCount,
      currentPage,

      bottomSliceIndex,
      topSliceIndex,
      paginationValues,

      selectPage,
    };
  },
};
</script>

<style lang="scss">
.logs {
  padding: 20px 50px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  height: 100vh;

  &-list {
    padding: 10px;
    width: 100%;

    border: 1px solid $primary-color;
    border-left: 0;
    border-right: 0;

    text-align: center;

    & th {
      padding: 15px 0;

      &:not(:first-child) span {
        cursor: pointer;
      }
    }

    & th:first-child,
    & td:first-child {
      width: 25%;
    }

    & th:last-child,
    & td:last-child {
      width: 35%;
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
}
</style>
