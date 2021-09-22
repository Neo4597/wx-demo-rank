/**
 * 子域刷新间隔
 */
const RenderInterval = 0.2; 

/**
 * 往子域发送的消息
 */
const DomainAction = {
    //上传新分数
    UpdateScore: "UpdateScore",
    //打开好友排行榜
    FriendRank: "FriendRank",

    //不管是用翻页或者滚动都在这里加对应的操作消息
};


cc.Class({
    extends: cc.Component,

    properties: {
        rankList:{
            default: null,
            type: cc.WXSubContextView
        },
        btnRefresh:{
            default: null,
            type: cc.Button
        },
        btnUploadScore:{
            default: null,
            type: cc.Button
        },
        editBoxScore:{
            default: null,
            type: cc.EditBox
        },
    },

    onLoad(){
        this.rankList.enabled = false;
        this.timer = 0;
    },

    refreshRank(){
        if(CC_WECHATGAME){
            wx.postMessage({
                action: DomainAction.FriendRank,
            });
        }
        console.log('重新绘制排行榜');
    },

    upLoadScore(){
        
        let uScore = parseInt(this.editBoxScore.string);
        if(CC_WECHATGAME){
            wx.postMessage({
                action: DomainAction.UpdateScore,
                score: uScore.toString()  //为了更像游戏结算时的操作，我把字符串格式化成整数，然后又格式化成字符串~
            });
        }
        console.log("上传分数", uScore.toString());
    },

    onEnable(){
        this.btnRefresh.node.on('click', this.refreshRank, this);
        this.btnUploadScore.node.on('click', this.upLoadScore, this);
    },

    onDisable(){
        this.btnRefresh.node.off('click', this.refreshRank, this);
        this.btnUploadScore.node.off('click', this.upLoadScore, this);
    },


    update (dt) {
        if(!CC_WECHATGAME)return;

        if(this.timer < RenderInterval){
            this.timer += dt;
            return;
        }

        this.timer = 0;
        this.rankList.update();
    },
});
