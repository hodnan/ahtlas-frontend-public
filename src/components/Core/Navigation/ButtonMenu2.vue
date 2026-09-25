 <template>    
    <div class="button">
      <div class="hex brand_xtx--text font-weight-light">
        <div class="dark"></div>
        <div class="dark"></div>
        <div class="dark"></div>
      </div>
      <div class="icon font-weight-light">
        <v-icon dark='dark' size="small" color="brand_silver">mdi-menu</v-icon>
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
    dark: { type: Boolean, default: false },
  },
 
}
</script>