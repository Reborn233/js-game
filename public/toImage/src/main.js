//model 模型
var Page = {
    list: [2,4,6,8,10]
};

var Demo = {
    //controller 控制器
    controller: function() {
        var lists = Page.list();
        return {
            pages: pages,
        }
    },

    //view 视图
    view: function(ctrl) {
        console.log(ctrl)
        return m("div", [
            m('ul',[
                ctrl.lists().map(function(list){
                    return m('li','Row '+list)
                })
            ])
        ]);
    }
};


//initialize 初始化
m.mount(document.getElementById("root"), Demo);