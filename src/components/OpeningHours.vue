<template>
  <header>
    <h1 class="text-4xl lg:text-6xl font-bold mb-12">Öppettider</h1>
  </header>
  <main class="max-w-5xl mx-auto px-4 sm:px-8">
    <div
      class="max-w-md p-6 mx-auto border border-gray-50 rounded-md shadow-xl"
    >
      <div
        v-for="(day, index) in days.list"
        @input="onInput(index)"
        :key="day.name"
        :class="{ 'text-red-500': isRedDay(day) }"
        class="border-b flex justify-between items-center focus-within:outline-black"
      >
        <div class="pl-2">{{ day.label }}</div>
        <input
          class="py-3 px-4 min-w-0 w-1/2 focus:outline-none"
          v-model="day.value"
          placeholder="öppettider"
        />
      </div>
      <button @click="ping" class="mt-6 w-full py-3 px-4 bg-red-200 rounded-md">
        Ping
      </button>
    </div>
  </main>
</template>

<script lang="ts">
import { ref, reactive, defineComponent } from "vue";
export default defineComponent({
  name: "HelloWorld",
  props: {
    msg: {
      type: String,
      required: true,
    },
  },
  setup: () => {
    const eventSource = new EventSource("http://localhost:8082/events");
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Got event", data);
      days.list = data;
    };

    eventSource.onerror = (error) => {
      console.warn("Event error");
    };

    const days = reactive({
      list: [
        {
          label: "Måndag",
          name: "monday",
          value: "8 - 12",
        },
        {
          label: "Tisdag",
          name: "tuesday",
          value: "8 - 12",
        },
        {
          label: "Onsdag",
          name: "wednesday",
          value: "8 - 12",
        },
        {
          label: "Torsdag",
          name: "thursday",
          value: "8 - 12",
        },
        {
          label: "Fredag",
          name: "friday",
          value: "8 - 12",
        },
        {
          label: "Lördag",
          name: "saturday",
          value: "8 - 12",
        },
        {
          label: "Söndag",
          name: "sunday",
          value: "8 - 12",
        },
      ],
    });

    const isRedDay = (day: any) => {
      return day.name === "saturday" || day.name === "sunday";
    };

    const onInput = (e: any) => {
      days.list.forEach((day) => {
        console.log(day.value);
      });
      ping();
    };

    const ping = () => {
      fetch("http://localhost:8082/openhours", {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(days.list),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    };
    return { days, isRedDay, onInput, ping };
  },
});
</script>
