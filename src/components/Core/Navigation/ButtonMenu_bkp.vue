 <template>
  <div class="button">
    <div class="hex brand_xtx--text font-weight-light">
      <div class="dark"></div>
      <div class="dark"></div>
      <div class="dark"></div>
    </div>
    <div class="icon font-weight-light">
      <v-icon dark="dark" size="small" color="brand_silver">mdi-menu</v-icon>
    </div>

    <div class="hex">
      <div class="dark"></div>
      <div class="dark"></div>
      <div class="dark"></div>
    </div>
  </div>
</template>
 
 <script>
export default {
  name: 'NavigationIcon',
  props: {
    dark: { type: Boolean, default: false }
  }
}
</script>

 
<style lang="scss" scoped>
// @import '~vuetify/src/styles/styles.sass';
// Hexagon
$sqrt3: 1.7320508075688772;
$edgeSize: 21px;
$hexWidth: $edgeSize * 2;
$hexHeight: $sqrt3 * $edgeSize;

// Display
$borderHover: 2px;

// $soft-white: var(--color);
$soft-light: #404040;
$soft-dark: #bfbfbf;

// Easing
$ease-out-expo: cubic-bezier(0.19, 1, 0.22, 1);
$ease-out-quart: cubic-bezier(0.165, 0.84, 0.44, 1);

.button {
  position: absolute;
  display: block;
  top: 25px;
  left: 30px;
  z-index: 9999;
  transform: translate3d(-50%, -50%, 0) rotate(0deg);
}
/* End of container */

// Contains 2 hexagons (.hex)
.button {
  cursor: pointer;
  width: $hexWidth;
  height: $hexHeight;
  float: left;

  &:last-child {
    margin-right: 0;
  }

  // Hover state
  &:hover {
    .hex:last-child {
      opacity: 0.8;
      transform: scale(1);
    }
    .hex:first-child {
      opacity: 0.6;

      div:before,
      div:after {
        height: $borderHover;
      }
      transform: scale(1.15);
    }
  }
}

// Contains 3 div that makes the hexagon
.hex {
  position: absolute;
  top: 0;
  left: calc($edgeSize / 2);
  width: $edgeSize;
  height: $hexHeight;
  opacity: 0.8;

  // Inset
  &:first-child {
    transform: scale(0.9);
    transition: all 0.3s $ease-out-quart;
    z-index: 0;
  }

  // Outset
  &:last-child {
    transition: all 0.3s $ease-out-expo;
    z-index: 1;
  }

  div {
    box-sizing: border-box;
    position: absolute;
    top: 0;
    width: $edgeSize;
    height: $hexHeight;

    &:before,
    &:after {
      content: ' ';
      position: absolute;
      width: 100%;
      height: 1px;

      transition: height 0.3s $ease-out-quart;
    }
    &:before {
      top: 0;
    }
    &:after {
      bottom: 0;
    }
    &:nth-child(1) {
      transform: rotate(0deg);
    }
    &:nth-child(2) {
      transform: rotate(60deg);
    }
    &:nth-child(3) {
      transform: rotate(120deg);
    }

    transform-origin: center center;
  }
  div.light {
    &:before,
    &:after {
      content: ' ';
      background: $soft-light;
    }
  }
  div.dark {
    &:before,
    &:after {
      content: ' ';
      background: $soft-dark;
    }
  }
}
.icon {
  position: absolute;
  top: 16.1px;
  left: 21.5px;
  transform: translate3d(-50%, -50%, 0) rotate(0deg);
}
</style>