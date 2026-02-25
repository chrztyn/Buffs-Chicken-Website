<template>
  <div class="calendar-grid">
    <!-- Days of week header -->
    <div class="grid grid-cols-7 gap-0 mb-2">
      <div
        v-for="day in daysOfWeek"
        :key="day"
        class="text-center text-sm font-['Unbounded'] font-semibold text-gray-700 py-2 bg-gray-100 border border-gray-200"
      >
        {{ day }}
      </div>
    </div>

    <!-- Calendar grid -->
    <div class="grid grid-cols-7 gap-0 border border-gray-200">
      <CalendarDayCell
        v-for="(day, index) in calendarDays"
        :key="index"
        :date="day.date"
        :isCurrentMonth="day.isCurrentMonth"
        :events="events"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import CalendarDayCell from './CalendarDayCell.vue'

interface Event {
  _id?: string
  id?: string
  name: string
  date_start: string
  date_end: string
  time: string
  location: string
  logo_url: string
  description?: string
}

const props = defineProps<{
  year: number
  month: number // 0-indexed (0 = January)
  events: Event[]
}>()

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const calendarDays = computed(() => {
  const days: Array<{ date: Date; isCurrentMonth: boolean }> = []
  
  // First day of the month
  const firstDay = new Date(props.year, props.month, 1)
  const firstDayOfWeek = firstDay.getDay()
  
  // Last day of the month
  const lastDay = new Date(props.year, props.month + 1, 0)
  const lastDate = lastDay.getDate()
  
  // Previous month's days
  const prevMonthLastDay = new Date(props.year, props.month, 0).getDate()
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    days.push({
      date: new Date(props.year, props.month - 1, prevMonthLastDay - i),
      isCurrentMonth: false
    })
  }
  
  // Current month's days
  for (let i = 1; i <= lastDate; i++) {
    days.push({
      date: new Date(props.year, props.month, i),
      isCurrentMonth: true
    })
  }
  
  // Next month's days to fill the grid
  const remainingDays = 42 - days.length // 6 rows × 7 days = 42
  for (let i = 1; i <= remainingDays; i++) {
    days.push({
      date: new Date(props.year, props.month + 1, i),
      isCurrentMonth: false
    })
  }
  
  return days
})
</script>

<style scoped>
.calendar-grid {
  width: 100%;
  min-height: 600px;
}
</style>
