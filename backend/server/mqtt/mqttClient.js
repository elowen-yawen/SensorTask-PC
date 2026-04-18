const mqtt = require('mqtt')
const EventEmitter = require('events')
const Joi = require('joi')
const promisePool=require('../config/promisepool')
class MqttClient extends EventEmitter {
    static defaultSetting = {
        url: 'mqtt://localhost:1883',
        option: {
            clientId: "猜猜我是谁"
        },
        subscribeTopics: [
            { topic: 'testTopic/#', qos: 1 }
        ]
    }
    constructor(config = {}) {
        super()
        this.config = {
            url: config.url || MqttClient.defaultSetting.url,
            option: { ...MqttClient.defaultSetting.option, ...config.option },
            subscribeTopics: config.subscribeTopics || MqttClient.defaultSetting.subscribeTopics
        }
        //url/subscribetopic是二选一的，但是option是多种都需要一起实现的
        this.client = null
        this.isConnected = false
        this.initClient();
    }
    initClient() {
        this.client = mqtt.connect(this.config.url, this.config.option)
        this.bindClientEvents()
    }
    bindClientEvents() {
        this.client.on('connect', () => {
            console.log('连接成功啦')
            this.subscribeAllTopics()
        })

        this.client.on('error', (err) => {
            console.error('连接错误：', err.message)
        })

        this.client.on('offline', () => {
            console.log('客户端离线')
        })

        this.client.on('reconnect', () => {
            console.log('正在重连...')
        })

        this.client.on('message', (topic, payload) => {
            let info
            try {
                //payroad原本是二进制，需要toString才能够转换成看得懂的字符串
                info = JSON.parse(payload.toString())
            } catch (err) {
                if (err) console.error('消息解析失败：', err)
            }
            if (topic === 'testTopic/1') {
                const schema = Joi.object({
                    id: Joi.number().required(),
                    d_no: Joi.number().required(),
                    field1: Joi.number().required(),
                    field2: Joi.number().required(),
                    field3: Joi.number().required(),
                    field4: Joi.number().required(),
                    field5: Joi.number().required(),
                    c_time: Joi.date().required(),
                    online: Joi.string().required()
                })
                const { value, error } = schema.validate(info)
                if (error) console.log(error)
                else {
                    console.log(info)
                    this.emit('message',topic, info)
                    this.SaveData(info)
                }
            }
        })
    }
    //语法格式
    // client.subscribe({
    //     "主题1": { qos: QoS级别 },
    //     "主题2": { qos: QoS级别 },
    //     // 更多主题...
    // }, (err) => {
    //     if (err) console.error('订阅失败：', err);
    //     else console.log('批量订阅成功');
    // });
    subscribeAllTopics() {
        const { config, client } = this
        const topics = config.subscribeTopics.reduce((acc, item) => {
            acc[item.topic] = { qos: item.qos }
            return acc
        }, {})
        client.subscribe(topics, (err) => {
            if (err) {
                console.error('批量导入失败：', err.message)
            } else {
                console.log("批量导入成功啦")
            }
        })
    }
    async SaveData (info){
        const params=[info.id,info.d_no,info.field1,info.field2,info.field3,info.field4,info.field5,info.c_time,info.online]
        try{
            await promisePool.execute(`insert into t_sensor_data 
            values(?,?,?,?,?,?,?,?,?)`,params)
        }catch(err){
            if(err) console.log(err)
        }
    }
}

module.exports = MqttClient