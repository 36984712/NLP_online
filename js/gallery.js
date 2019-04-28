var gallery = {
    // the height of each column
    top_array:[0,0,0,0,0],
    // the distance between each column and the left of the page
    left_array:[],
    // the queue of images need to be added every time
    image_queue:[],
    // total number of images added every time
    num:0,
    // the total number of images
    num_images_dataset:9
}

$(function(){
    getData();
    get_min_height();

});

function getData(){
    // put images in the page
    $.getJSON(
        "json/image.json",
        function(data){
            if(data.success){
                var row = data.row,
                    len = row.length,
                    html = "";
                for(var i = 0;i < len;i++){
                    // generate the divs need to be added
                    html += "<div class='img-box'>"
                        + "<img src='image/"+row[i].src+ ".png" +"'/><p>"+ row[i].src +"</p></div>";
                }
                $("#container").append(html);

                // update the left distance of each column
                get_left();

                // put full screen
                if(get_min_height()<window.screen.height){
                    getData();
                }

                gallery.image_queue = [];

                // modify the new added images' positions
                $("#container .img-box").each(function(i){
                    if(i >= gallery.num){
                        gallery.image_queue.push(this);
                    }
                })
                gallery.num += gallery.num_images_dataset;
                reset();
            }
        }
    )
}

function get_min_height(){
    // get the shortest column
    var min_height = Math.min.apply(null,gallery.top_array);
    return(min_height);
}

function get_left(){
    // get the distance between each column and left
    for(var i = 0; i < 5; i++){
        var left = $("#container .img-box").eq(i).offset().left;
        gallery.left_array.push(left);
    }
}

function reset(){
    // set the position of images in the queue
    var img = gallery.image_queue;
    for (var i = 0,len = img.length; i < len; i++) {
        var	minHeight = get_min_height(),
            index = 0;

        for(var x = 0; x < gallery.num_images_dataset; x++){
            if(minHeight == gallery.top_array[x]){
                index = x;
                break;
            }
        }
        $(img[i]).css({
            "position":"absolute",
            "top":minHeight,
            "left":gallery.left_array[index]
        });

        gallery.top_array[index] += $(img[i]).height();
    }
}

window.onscroll = function(){
    // when scroll half screen, reload
    var minHeight = get_min_height();
    if(window.scrollY>minHeight/2){
        getData();
    }
}
