<template>
    <section class="main">
        <div id="a" class="item" draggable="true">武器</div>  
        <div id="b" class="item" draggable="true">衣服</div>  
        <div id="c" class="item" draggable="true">鞋子</div>  
        <div id="d" class="item" draggable="true">法宝</div>  
        <div class="backpack" id="div1"><h4>人物属性</h4></div>  
        <div class="backpack" id="div2"><h4>背包</h4></div><br />  
        <div id="div3"><h5>上面两个框的内容拖到此处可删除</h5></div> 
    </section>
</template>

<script>
    import $ from 'jquery'
    export default {
        data() {
            return {
            }
        },
        components:{
        },
        mounted () {
            this.dragPanelMove()
        },
        methods: {
            dragPanelMove(){
                //拖放开始:获取id放入dataTransfer  
                $(".item").on("dragstart",function(e){
                    console.log('1')
                    e.originalEvent.dataTransfer.setData("obj_add",e.target.id);  
                });  
                
                //允许放入  
                $("#div1").on("dragover",function(e){  
                    e.originalEvent.preventDefault();  
                })  
                
                //允许放入  
                $("#div2").on("dragover",function(e){  
                    e.originalEvent.preventDefault();  
                })  
                
                //允许放入  
                $("#div3").on("dragover",function(e){  
                    e.originalEvent.preventDefault();  
                })
                //放下事件  
                $("#div1").on("drop",function(e){
                    e.originalEvent.preventDefault;  
                    var id = e.originalEvent.dataTransfer.getData("obj_add");  
                    $(this).append($("#"+id));  
                    //给新加入的元素添加拖放事件  
                    $("#"+id).on("dragstart",function(e){  
                        e.originalEvent.dataTransfer.setData("obj_remove",e.target.id);  
                    });  
                })  
                
                //放下事件  
                $("#div2").on("drop",function(e){  
                    e.originalEvent.preventDefault;  
                    var id = e.originalEvent.dataTransfer.getData("obj_add");  
                    $(this).append($("#"+id));  
                    //给新加入的元素添加拖放事件  
                    $("#"+id).on("dragstart",function(e){  
                        e.originalEvent.dataTransfer.setData("obj_remove",e.target.id);  
                    });  
                })  
                
                //放下事件 用来删除  
                $("#div3").on("drop",function(e){  
                    e.originalEvent.preventDefault;               
                    var r = e.originalEvent.dataTransfer.getData("obj_remove");  
                    $("#"+r).remove();  
    
                })
            }
        }
    }

    $(function() {              
            //拖放开始:获取id放入dataTransfer  
            $(".item").on("dragstart",function(e){  
                console.log('1')
                e.originalEvent.dataTransfer.setData("obj_add",e.target.id);  
            });  
              
            //允许放入  
            $("#div1").on("dragover",function(e){  
                e.originalEvent.preventDefault();  
            })  
              
            //允许放入  
            $("#div2").on("dragover",function(e){  
                e.originalEvent.preventDefault();  
            })  
              
            //允许放入  
            $("#div3").on("dragover",function(e){  
                e.originalEvent.preventDefault();  
            })  
              
              
            //放下事件  
            $("#div1").on("drop",function(e){  
                e.originalEvent.preventDefault;  
                var id = e.originalEvent.dataTransfer.getData("obj_add");  
                $(this).append($("#"+id));  
                //给新加入的元素添加拖放事件  
                $("#"+id).on("dragstart",function(e){  
                    e.originalEvent.dataTransfer.setData("obj_remove",e.target.id);  
                });  
            })  
              
            //放下事件  
            $("#div2").on("drop",function(e){  
                e.originalEvent.preventDefault;  
                var id = e.originalEvent.dataTransfer.getData("obj_add");  
                $(this).append($("#"+id));  
                //给新加入的元素添加拖放事件  
                $("#"+id).on("dragstart",function(e){  
                    e.originalEvent.dataTransfer.setData("obj_remove",e.target.id);  
                });  
            })  
              
            //放下事件 用来删除  
            $("#div3").on("drop",function(e){  
                e.originalEvent.preventDefault;               
                var r = e.originalEvent.dataTransfer.getData("obj_remove");  
                $("#"+r).remove();  
  
            })
        });  

</script>

<style scoped>
.backpack {width:400px;height:200px;border:1px solid #aaaaaa;}  
#div3 {width:200px;height:200px;border:1px solid #aaaaaa;}  
.item{  
    display:inline-block;  
    background-color: antiquewhite;  
    height: 25px;  
    width: 50px;  
}  
</style>
