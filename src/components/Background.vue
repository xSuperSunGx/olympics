<template>
  <div class="mainbackground">
    <div class="roww" v-for="i in row">
      <div v-for="c in column">
        <i class="fa fa-user-secret" aria-hidden="true"></i>
        <i class="fa fa-snowflake-o" aria-hidden="true"></i>
        <i class="fa fa-bell" aria-hidden="true"></i>
        <i class="fa fa-bolt" aria-hidden="true"></i>
        <i class="fa fa-code" aria-hidden="true"></i>
        <i class="fa fa-mobile-phone" aria-hidden="true"></i>
        <i class="fa fa-heart" aria-hidden="true"></i>
        <i class="fa fa-university" aria-hidden="true"></i>
        <i class="fa fa-tag" aria-hidden="true"></i>
        <i class="fa fa-search" aria-hidden="true"></i>
        <i class="fa fa-rss" aria-hidden="true"></i>
        <i class="fa fa-flag-o" aria-hidden="true"></i>
        <i class="fa fa-magic" aria-hidden="true"></i>
        <i class="fa fa-wrench" aria-hidden="true"></i>
        <i class="fa fa-graduation-cap" aria-hidden="true"></i>
        <i class="fa fa-battery-2" aria-hidden="true"></i>
        <i class="fa fa-balance-scale" aria-hidden="true"></i>
        <i class="fa fa-bug" aria-hidden="true"></i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Background",
  props: {
    row: {
      type: Number,
      default: 40
    },
    column: {
      type: Number,
      default: 20
    }
  },setup() {
  }, methods: {

  }
}
</script>

<style>

:root {
  --color_black: 0,0,0;
  --color_white: 255,255,255;
  --text_color_black: rgba(var(--color_black), 0.5);
  --text_color_white: rgba(var(--color_white), 0.5);
  --background_color_black: #111;
  --background_color_white: #eee;
  --hove_color: aq
}

*{
  margin: 0;
  padding: 0;
}
.mainbackground {
  position: relative;
  width: 100%;
  height: 100vh;
  background: var(--background_color_white);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.mainbackground .roww {
  position: relative;
  top: -75%;
  width: 100%;
  display: flex;
  padding: 5px 0;
  white-space: nowrap;
  font-size: 64px;
  transform: rotate(-30deg);
}

i {
  color: var(--text_color_white);
  transition: 1s;
  padding: 0 5px;
  user-select: none;
  cursor: default;
}

i:hover {
  color: #0e0;
  transition: 0s;
  text-shadow: 0 0 120px #0e0;
}

.mainbackground .roww div:nth-child(odd) {
  animation: animate1 80s linear infinite;
  animation-delay: -80s;
}
.mainbackground .roww div:nth-child(even) {
  animation: animate2 80s linear infinite;
  animation-delay: -40s;
}
.mainbackground .roww:nth-child(even) div:nth-child(odd) {
  animation: animate3 80s linear infinite;
  animation-delay: -80s;
}
.mainbackground .roww:nth-child(even) div:nth-child(even) {
  animation: animate4 80s linear infinite;
  animation-delay: -40s;
}


@keyframes animate1 {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
  }
}

@keyframes animate2 {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(-200%);
  }
}
@keyframes animate3 {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

@keyframes animate4 {
  0% {
    transform: translateX(-200%);
  }
  100% {
    transform: translateX(0%);
  }
}

</style>