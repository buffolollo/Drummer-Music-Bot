const { VoiceState, Client } = require("discord.js")

module.exports = {
    name: "voiceStateUpdate",
    /**
     * 
     * @param {VoiceState} oldstate 
     * @param {VoiceState} newstate 
     * @param {Client} client 
     */
    execute(oldstate, newstate, client){
        if(oldstate.member.id != "928001727309946932") return;
        if(oldstate.channelId && !newstate.channel){
            console.log("a")
        }
    }
}