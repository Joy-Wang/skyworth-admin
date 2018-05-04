<template>
  <div class="sw-template">
      <div class="sw-temp-warp">
        <div class="sw-temp-box">
            <div>
                <ul>
                    <li>
                        <div class='sw-row-point3'></div>
                    </li>
                    <li>
                        <div class='sw-row-point2'></div>
                        <div class='sw-row-point1'></div>
                    </li>
                    <li>
                        <div class='sw-row-point1'></div>
                        <div class='sw-row-point1'></div>
                        <div class='sw-row-point1'></div>
                    </li>
                </ul>
            </div>
        </div>
      </div>
  </div>
</template>

<script>
export default {
  methods: {
      goBack(){
          this.$router.go(-1);
      }
  }
}
</script>

<style scoped>
.sw-template{
    width: 90%;
    text-align: center;
    overflow: hidden;
    padding: 5%;
}
.sw-temp-warp{
    margin: 0 auto;
    width: 100%;
    height: 300px;
    background: #fff;
    border: 1px solid #666;
}
.sw-temp-box{
    width: 100%-20px;
    height: 100%;
    overflow: auto;
    padding: 20px;
}
.sw-temp-box ul{
    margin: 0 auto;
}
.sw-temp-box ul li{
    width: 200px;
    height: 260px;
    float: left;
    list-style: none;
    margin: 0 10px;
}
.sw-temp-box ul li .sw-row-point3{
    width: 100%;
    height: 260px;
    background: url('../../../static/img/test.jpg');
    border-radius: 5px;
}
.sw-temp-box ul li .sw-row-point2{
    width: 100%;
    height: 160px;
    background: url('../../../static/img/test.jpg');
    margin-bottom: 20px;
    border-radius: 5px;
}
.sw-temp-box ul li .sw-row-point1{
    width: 100%;
    height: 80px;
    background: url('../../../static/img/test.jpg');
    border-radius: 5px;
}
.sw-temp-box ul li .sw-row-point1:nth-child(2){
    margin: 10px 0;
}
</style>
