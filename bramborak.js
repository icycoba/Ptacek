const { count } = require('console');
const Discord = require('discord.js')
const { EventEmitter } = require('events')
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] })
const fs = require('fs')
const { prefix, token } = require('./config.json');
let listen = 0
const talkedRecently = new Set()
let speakRecently = false


let maxDelka = 110
let minDelka = -5
let cooldown = 30000

let flag1 = false
let flag2 = false

// měření, also tabulka
let lastMessage = []
let delkaUzivatele = []
let delkaLast = []
let pocetMereni = []
let delkaCelkem

// tabulka rekordmanů
let ids = []
let role = []
let emojiID = []
let roleID = []



client.msgs = require('./delky.json');

client.on('ready', () => {
    console.log("Loaded " + client.user.tag)
    client.user.setActivity("Uchyl z Chebu Trilogy", {type: "WATCHING"})

    let guild = client.guilds.cache.find(guild => guild.id == '265108500378550272');

    // #role
    let channel = client.channels.cache.get('797181534313906227')

    // #bot-room-ready
    let annoChannel = client.channels.cache.get('804757881979273267')

    
    // proměnné channelů
    let minDelChannel = client.channels.cache.get('810620250327744532')
    let maxDelChannel = client.channels.cache.get('810620209756110888')
    annoChannel.send("Loaded " + client.user.tag)


    channel.messages.fetch({ limit: 10 })
        .then(async messages => {
            messages.forEach(async message => {

                const args = message.content.slice(prefix.length).trim().split(' ');
                const command = args.shift().toLowerCase();

                //recyklace kódu
                // TODO BOT PO RESTARTU NEDÁ REACT POKUD SE ZPRÁVA UPRAVÍ
                if (command === 'role'){
                    if(message.author.id == '174960316868853762'){
                        i = 0
                        for(i; i < 9; i = i+2){
                            emojiID[i] = args[i]
                            message.react(args[i])
                            console.log(args[i])
                            console.log("reaction whore")
                            if(args[i+2] == null){
                                break
                            }
                        }
                        
                        ii = 1
                        for(ii; ii<=9; ii = ii + 2){
                            role[ii] = args[ii]
                            roleID[ii] = message.guild.roles.cache.find(r => r.name === role[ii]);
                            if(args[ii + 2] == null){
                                break
                            }
                        }
                    }
                }

                if (message.partial) await message.fetch();
                if (!message.guild) return;
                let e = -2

                for (let reactionObj of message.reactions.cache) {
                    for (let reaction of reactionObj) {
                        if (typeof reaction == "string") continue;

                        // mirny hardcode, ale co
                        // 
                        if(reaction.emoji){
                            e = e + 2
                            emojiID[e] = reaction.emoji.id
                        }

                        //console.log(emojiID[0])
                        //console.log(emojiID[2])
                        
                        reaction.users.fetch()
                            .then(async users => {
                                users.forEach(async user => {
                                    if (user.bot) return;
                                        try{
                                            if(emojiID[0].includes(reaction.emoji.id)){
                                                await reaction.message.guild.members.cache.get(user.id).roles.add(roleID[1])
                                            }
                                            if(emojiID[2].includes(reaction.emoji.id)){
                                                await reaction.message.guild.members.cache.get(user.id).roles.add(roleID[3])
                                            }
                                            if(emojiID[4].includes(reaction.emoji.id)){
                                                await reaction.message.guild.members.cache.get(user.id).roles.add(roleID[5])
                                            }
                                            if(emojiID[6].includes(reaction.emoji.id)){
                                                await reaction.message.guild.members.cache.get(user.id).roles.add(roleID[7])
                                            }
                                            if(emojiID[8].includes(reaction.emoji.id)){
                                                await reaction.message.guild.members.cache.get(user.id).roles.add(roleID[9])
                                            }
                                        } catch{
                                            console.error()
                                        }
                                    })
                            })
                    }
                }

            });
        })
        .catch(console.error);


    minDelChannel.messages.fetch({ limit: 1})
        .then(async messages =>{
            let lastMes = messages.first();
            minDelka = parseInt(lastMes.content)
            annoChannel.send("Mindélka je: " + minDelka)
            flag1 = true
        })
        .catch(console.error);

    maxDelChannel.messages.fetch({ limit: 1})
        .then(async messages =>{
            let lastMes = messages.first();
            maxDelka = parseInt(lastMes.content)
            annoChannel.send("Maxdélka je: " + maxDelka)
        })
        .catch(console.error);
    
    console.log(flag1, flag2)
    
})



client.on('message', (receivedMessage) => {
    if (!receivedMessage.content.startsWith(prefix) || receivedMessage.author.bot){
        console.log("Něco jsem napsal na discord")
        return;
    }


    const args = receivedMessage.content.slice(prefix.length).trim().split(' ');
    const command = args.shift().toLowerCase();
    let rolesChannel = client.channels.cache.get('797181534313906227')

    // proměnné channelů
    let minDelChannel = client.channels.cache.get('810620250327744532')
    let maxDelChannel = client.channels.cache.get('810620209756110888')

    // 'ty zmrde' ve zprávě
    if (receivedMessage.content.includes('ty zmrde')){
        receivedMessage.reply('neříkej mi zmrde!')
    }
    
    // 'ty rakovino' ve zprávě
    else if (receivedMessage.content.includes('ty rakovino')){
        receivedMessage.channel.send('ale žádná rakovina..')
    }

    else if (receivedMessage.content.includes('ty čuráku')){
        receivedMessage.channel.send('já ti dám čuráku')
    }

    // zpráva = 'hej bramborák'
    else if (receivedMessage.content === 'hej bramborák'){
        receivedMessage.reply('já ti dám bramborák!')
    }

    // 'poď sem' ve zprávě
    else if ((receivedMessage.content.includes('poď sem')) || (receivedMessage.content.includes('pod sem'))){
        if (receivedMessage.member.voice.channel){
            const connection = receivedMessage.member.voice.channel.join().then(connection =>{
                const dispatcher = connection.play('./zvuky/ahojahojahoj.mp3')
            })
        } else{
            receivedMessage.reply('nevidím tě v žádném voicu')
        }
    }

    // 'běž do prdele' ve zprávě
    else if ((receivedMessage.content.includes('běž do prdele')) || (receivedMessage.content.includes('bez do prdele'))){
        if (receivedMessage.member.voice.channel){
            const connection = receivedMessage.member.voice.channel.leave();
        } else{
            receivedMessage.reply('musíš být ve stejném voicu')
        }
    }

    // zpráva = 'hej bramborák pověz lore'
    else if (receivedMessage.content === 'hej bramborák pověz lore'){
        if (receivedMessage.member.voice.channel){
            const connection = receivedMessage.member.voice.channel.join().then(connection =>{
                const dispatcher = connection.play('./zvuky/bramboLore.mp3')
            });
        } else{
            receivedMessage.reply('musíš být ve stejném voicu')
        }
    }


    // zpráva = 'ukaž ptáčka'
    else if (receivedMessage.content === 'hej bramborák ukaž nám ptáčka'){
        const ukazPtacka = new Discord.MessageAttachment('./obrazky/buh.png')
        receivedMessage.channel.send(ukazPtacka)
    }

    // kde je / kde máš zuby / kde jsi byl
    else if (command === 'kde'){
        if(!args.length){
            return receivedMessage.channel.send(`Nerozumím`)
        }
        if(args[0] === 'je'){
            if(!args[1]){
                return receivedMessage.channel.send(`Nerozumím`)
            }
            var tmp = args[1]
            var i = 2
            console.log("ok jdu hledat")
            while(args[i] != null){
                tmp = tmp + " " + args[i]
                i++
                console.log("while cyklus")
            }
            receivedMessage.channel.send(`${tmp}? To mi něco říká`)
            receivedMessage.channel.send(`https://maps.google.com/?q=${encodeURIComponent(tmp)}`)
        }
        if((args[0] === 'máš') && (args[1] === 'zuby')){
            receivedMessage.channel.send(`No v tlamě, kde bych je jako měl mít`)
        }
        if((args[0] === 'jsi') && (args[1] === 'byl')){
            if(receivedMessage.author.id === '232903085838696448'){
                return receivedMessage.channel.send(`No na stavbě, kde bych jako asi moh bejt vole`)
            }
            receivedMessage.channel.send(`No na baráku, kde bych jako asi moh bejt vole`)
        }
    }

    // catjam
    else if (command === 'catjam'){
        if((args[0] == 0) || (args[0] == null)){
            receivedMessage.channel.send(`<a:catjam:780090837300019260>`)
        } else if(args[0] >= 69){
            return receivedMessage.channel.send("Toho je na mě nějak moc")
        } else if(args[0] >= 1){
            var i = 1
            args[0] = Math.floor(args[0])
            for(i; i<=args[0]; i++){
                console.log("i" + i)
                console.log("args" + args[0])
                if (i == args[0]){
                    receivedMessage.channel.send(`<a:catjam:780090837300019260>`.repeat(i))
                    if (i == 38){
                        if (receivedMessage.member.voice.channel){
                            const connection = receivedMessage.member.voice.channel.join().then(connection =>{
                                const dispatcher = connection.play('./zvuky/catjam.mp3')
                            });
                        }
                    }
                    if (i == 42){
                        if (receivedMessage.member.voice.channel){
                            const connection = receivedMessage.member.voice.channel.join().then(connection =>{
                                const dispatcher = connection.play('./zvuky/tylkojedno.mp3')
                            });
                        }
                    }
                }
            }
        }
    }

    //crabrave
    else if (command === 'crabrave'){
        if((args[0] == 0) || (args[0] == null)){
            receivedMessage.channel.send(`<a:crabrave:780092357617254452>`)
        } else if(args[0] >= 65){
            return receivedMessage.channel.send("Toho je na mě nějak moc")
        } else if(args[0] >= 1){
            var i = 1
            args[0] = Math.floor(args[0])
            for(i; i<=args[0]; i++){
                console.log("i" + i)
                console.log("args" + args[0])
                if (i == args[0]){
                    receivedMessage.channel.send(`<a:crabrave:780092357617254452>`.repeat(i))
                }
            }
        }
    }

    else if (command === 'dancingroach'){
        if((args[0] == 0) || (args[0] == null)){
            receivedMessage.channel.send(`<a:dancingroach:789213525972353084>`)
        } else if(args[0] >= 58){
            return receivedMessage.channel.send("Toho je na mě nějak moc")
        } else if(args[0] >= 1){
            var i = 1
            args[0] = Math.floor(args[0])
            for(i; i<=args[0]; i++){
                console.log("i" + i)
                console.log("args" + args[0])
                if (i == args[0]){
                    receivedMessage.channel.send(`<a:dancingroach:789213525972353084>`.repeat(i))
                    if (i == 57){
                        if (receivedMessage.member.voice.channel){
                            const connection = receivedMessage.member.voice.channel.join().then(connection =>{
                                const dispatcher = connection.play('./zvuky/roachautotune.mp3')
                            });
                        }
                    }
                    if (i == 24){
                        if (receivedMessage.member.voice.channel){
                            const connection = receivedMessage.member.voice.channel.join().then(connection =>{
                                const dispatcher = connection.play('./zvuky/hoesmad.mp3')
                            });
                        }
                    }
                }
            }
        }
    }

    // drž piču
    else if (command === 'drž'){
        if(!args.length){
            return receivedMessage.channel.send(`Nerozumím`)
        }
        if(args[0] === 'piču'){
            if (receivedMessage.member.voice.channel){
                const connection = receivedMessage.member.voice.channel.join().then(connection =>{
                    const dispatcher = connection.play('./zvuky/silence.mp3')
                });
            }
        }
    }


    // weirdchomp ascii; icycoba/krocan only
    else if (command === 'hosihosicotudelate'){
            if(receivedMessage.author.id === '174960316868853762' || receivedMessage.author.id === '265179652946001923'){
                console.log("posílám weirdchompa")
                
                receivedMessage.channel.send(`\`\`\`kkxxdddddddoooooddooooddddxxxxxkkkkkOOOOOOOOOOOOOO000000000000000OOOOOOOOkkkkkkkxxxxddddooooollll\nkkxxxddddxxxxxxkkkkxxxxxxxkkkkkkkOOOOOOOOOOOOOOOOO0000000000000OOOkkkkOkkkkkkkkkkxxxdddooooooooll\nxxxxxxxxxxkkkOOOOOO0OOOOOOOOkkkkkkkkkOOOOOOOOOOOOO000000000000OOkkxkkkkkkkkOOOkkkxxxdddoooooolllc\nxxxxxxxxkkkOO00000000000OOOOOkkkkkkkkkkkkOOOOOOOOOOOOO000OOOOOOkxxxkkkkkkOOOOOOkkxxxdddooooollllc\nxxxxxxxkkkOOO00OOOkkkkkkkkkkxxxxxxxxddxxxkkkkkOOOOkkkkOOOOkkkkkxxxxkkkkkkkOOOkkkkkkxxdooooollllcc\nxxxxxxxkkOOOOOOkxdoooooooolllllllllllooodddxxkkkkkkxxkkkkkxdddddddxxxxxxxxxkkkkkkkxxxddoolllllccc\nxxxxxxxkkkkkkkxddoolcc::::;;;;;;;::::ccllooddxxxxxxdddxxdddollllllllloooooooooodddxxddoolllllcccc\nxxxxxxxxkxxddddoooooollc::;;;;,,;;;::::cccllodddddddooddoollc:::::;;;;;;::::::clllodddoollllccccc\nxxxxxxxxxdooddxxxxxkkkkkxdolcc::::::::::ccclloodddooollllccc::;;;,,,,,,,,,;;;::cclllllllllccccccc\nxxxxxxxdddddxxkOOOOOOOOOOOkxdollcccc::::cccclooooooollccc:::;;;;;;;::::cccccccccccccccccccccccccc\nxxxxxxddxxxxxkkkkkkkkxxxxxdooolllccccccccccclooooooollc:::;;;;::cclloddxxxxxddoollccccccccccccccc\nxxxxxxxxxxxxxxxdddoooolllccc:::ccccccccllllooddxdddoolc::;;:::cccllooddddddddddooollccccccccccccc\nxxxxxxdddddddolc::;,,,,'''',;;,,,;:cccclooodxkkOOOOxdocc::::::cc::::::cllllollllllllccccccccccccc\nxxxxxxddoollc:;;;::;;;;;;;;:c::;;,;;:clloddxkO0KKKK0kdlc::::c:;,,;;''''..'',;;;::cccccccccccccccc\nxxkkkxxddlccccccclllllllcccccccccc::clooodxxkO0KKKK0Oxocccccc;,;:cc:;;,,,''',,'',;::ccccccccccccc\`\`\``)
                receivedMessage.channel.send(`\`\`\`xxkkkkkkxxddddoooolllllccccccccc:ccclloddxxxkO0KKKKK0kxlcccccccccccllcccc:::::;;;;;;:::cccccccccc\nkkkkOOOOOOOkkxxxddooolllcllccccccclloodxxxxkkO0KKKKK0Okdlccccccccccccccccccc:::::;::::ccccclccccc\nkkkkOOOOO000OOkkxxxdddoolllllllloodxxkkkkkkkkO0KKKKK00kdollcccccccccccccccc::::::cccclllllllllccc\nkkkkkOOO0000000OOkkxxxxddddddddxxkkOOOOkkkkkOO0KKKKK00Oxdolooolllccllllccccccccccllloooooooollccc\nkkkkOOOOO0000000OOOOkkkkkkkkkOOOOOOOOOOOOOOOO00KKKKKK0Oxdooooddooollloooooolllooooooddddoooollccc\nkkkkOOOOOO00000000OOOOOOOOOOOO0000OOOOOOOOOO000KKKKKK0Oxddoooddddddddddddddddddddddddddddooollccc\nkkkkOOOOOO00000000000000000000000000000OOO00000KKKKKK0Okxdddddxxxxxxkkxxxxxxxxxddddddddddooollcc:\nkkkOOOOOOOO000000000000000000000000000OOOOO000KKKKKKKK0kxdddddxxkkkkkkkkkkkkxxxxddddddddddoollc::\nkkkkOOOOO00000KKKKKKK0000KKKKKKK000OOOOOOOO0KKKKKKXXKK0OkddooddxkkkOOOOOOOOkkkxxddddddddddoolcc:;\nkkkkOOOOO0000KKKKKK00000KKKKKK00OkkOOOOO000KKKXXXXXKKK00kxdddddxxkkOOOOOOOOOOkkkkxxxdddddooolcc::\nkkkkkOOOO000KK000000000000000OkxdxkO000000KKKKXKKKKKK00OkxxxxxxddxkkkOOkkkkkkkkkkkkxxxdddooolcc::\nkkkkkOOOO000000000000000000OkxdddxkkkOkkkkkOO00OOOOkkkkxxddoddddddxkkkkkkkkkkkkkkkxxxxdddoollcccc\nkkkkkkOOOOO0000000000000OOkkxdddddollcccllooddddooooooooollcccclloodxxxkkkkkkkxxxxxxddddooolccloo\nkkkkkkkOOOOOOOOOOOOOOOOOkkxxxxkkxdl:;,,,,;::cccccccccccc:;,'',;::loooddxxxxxxxxxxxddddoooollccloo\nkkkkkkkOOOOOOOOOOOOOOOkkkxxkkOOOOkdl::::::::;;;;;;;;:;;;,,''',;:clllloodddddddddddddooooollccclll\`\`\``)
                receivedMessage.channel.send(`\`\`\`kkkkkkkOOOOOOOOOOOkkkkkxxxkOO000OOkxddoolllcc::;;;;;;;;;;;;;;;:cllllcclllooooooooooooolllllccclll\nkkkkkkkkkkkkkkkkkkkkxxxxxxkkO000OOkkkkxxddoolcc::::::::::::::ccllllcc:ccllloooooooolllllccccccloo\nkkkkkkkkkkkkkkkkkxxxxxxxxxkkOOOOOkkkkkkkxxxdoolcccccccccccccccllllllc:::ccllllllllllllllcccccclod\nkkkkkkkkkkkkkkkxxxxxxddddxxkkkkkkkkkkkkkkkkxxdooolllooolllllllllllllcc:::ccclllllllllllcccccclokK\nxkkkkkkkkkkkkxxxxxxddoooddxxxxxkkkkkkkkxxxdddddoooooddolllllllllllllccccccccllllllllllccccccdKNWM\nxxxkkkkkxkxxxxxxxxxdolloooooodddddddoooolllcclloollllcc::cccccclccccccllc:clllllllllccccccclOWMMM\nxxxxxxxxxxxxxxxxxxxdolcccccccccc:::::::::::::::::::::;;;;;;;;:::::::::::::clollllccccccccccoKMMMM\nxxxxxxxxxxxxddxxxxxdolcc::::;;;;:::;;;:::;;;;;;;;;;,,,,,,,,,,,,,'',,;;::ccooolllcccccccccclkNMMMM\ndxxxxxxxxxxxxddxxxxddoolllooollllllllclllllllcc:::::::::::;;;;;,,;:::cclloooollcccccccccccdXMMMMM\nddddxxxxxxxxxxxxxxxdddddxxxxxxdddooollccccccccccccccc::::;;:::cccccllooooooollccccccccccco0WMMMMM\ndddddxxxxxddddddxxdxxxxxkkkkkxxxxddddooolccc::::::::;;:::::cclllllloooooooollccccccccccclOWMMMMMM\noooddddddddddddddddxxxxxkkkkkkkxxxdddddoolllccc::::::::ccclllllllloooooooolccccccccc:::lONMMMMMMM\nooooodddddddddddddddxxxxkkkkkkkkxxxdddooooolllccccccccccccllccllllooooooolccccccccc:::lOWMMMMMMMM\nllooooddddddddddddddxxxxkkkkkkkkkxxxxdddddooooolllllllllccllllllllllooollcccccccc:::co0WMMMMMMMMM\nllloooooddddddddddddxxxxkkkkkkkkkkkxxxxxxxdddddooooooolllllllllllooooollcccccc:::::cdKWMMMMMMMMMM\nollllooooooddddddddddxxxkkkkkkkkkkkkkkkkkkxxxxxxxxdddoooollllllooooolllcccccc:::::cxNMMMMMMMMMMMM\ndolllllooooooddddddddxxkkkkkkkkkkkkkOOOOOkkkkxxxxddddddddooooooddoollcccc:::::::::xXMMMMMMMMMMMMM\nxdoolllloooooodddddddxxxkkkkkkkkkkkOOOOOOOkkkkxxxxxxxxxdddxxdddddoollcc::::::::::l0MMMMMMMMMMMMMM\nxxdoolllloooooodddddddxxkkkkkkkkkOOOOOOOOkkkkkkxxxxxxxxxxxxxxxxdoollcc:::::::::::oKMMMMMMMMMMMMMM\`\`\``)
                console.log("poslal jsem weirdchompa")
            }
    }

    // kolik měří
    else if (command === 'kolik'){
        //console.log(args[0])
        //console.log(args[0].toLowerCase())
    

        console.log(args[0])
        args[0] = args[0].slice(0,4)
        console.log(args[0])
        if ((args[0].toLowerCase() === 'měří' || args[0].toLowerCase() === 'meri') || (args[0].toLowerCase() === 'ti' && args[1].toLowerCase() === 'je')){
            console.log(args[0])
            let now = new Date()
            let botRoom = client.channels.cache.get('342465747357794305')
            if (receivedMessage.channel.id === '342465747357794305' || receivedMessage.channel.id === '663774051566878746'){
                if(talkedRecently.has(receivedMessage.author.id)){
                    let cooldownRemaining = Math.round(((cooldown-(now-lastMessage[receivedMessage.author.id]))/1000))
                    if(cooldownRemaining>4){
                        receivedMessage.reply(`zbývá ti ${cooldownRemaining} sekund cooldownu`)
                    } else if(cooldownRemaining>1){
                        receivedMessage.reply(`zbývají ti ${cooldownRemaining} sekundy cooldownu`)
                    } else if(cooldownRemaining>0){
                        receivedMessage.reply(`zbývá ti ${cooldownRemaining} sekunda cooldownu`)
                    } else{
                        receivedMessage.reply(`cooldown by měl vypršet každou chvíli`)
                    }
                } else{
                    /*
                    let minDelkaVyp = Math.round((Math.random()*minDelka))
                    let minDelkaChance = Math.random()
                    if(minDelkaChance < 0.5){
                        minDelkaVyp = 0
                    }

                    let delka = Math.round((Math.random())*maxDelka) + minDelkaVyp
                    */
                    let delka = Math.floor(Math.random() * (maxDelka - minDelka + 1) + minDelka)
                    //let delka = maxDelka  // DEBUG
                    console.log(delka)

                    if(delka === maxDelka){
                        let role = receivedMessage.guild.roles.cache.get("783413473848852541")
                        let roleSpec = receivedMessage.guild.roles.cache.get("786745678818050108")

                        receivedMessage.member.roles.add(role).catch(console.error)
                        let i = 1
                        receivedMessage.guild.members.cache.forEach(member => {
                            member.roles.remove(roleSpec);
                        });
                        console.log("nový člověk je rekordmanem!")
                        
                        console.log(receivedMessage.author.tag, `má ${delka} cm`)
                        talkedRecently.add(receivedMessage.author.id)
                        setTimeout(() => {
                            talkedRecently.delete(receivedMessage.author.id);
                        }, cooldown)

                        maxDelka = maxDelka + 1
                        console.log(`nová nejvyšší délka: ${maxDelka}`)
                        receivedMessage.member.roles.add(roleSpec).catch(console.error)

                        if(!(ids.includes(receivedMessage.author.id))){
                            ids.push(receivedMessage.author.id)
                            console.log(ids)
                        }

                        if(!delkaLast[receivedMessage.author.id] || !delkaUzivatele[receivedMessage.author.id] || !pocetMereni[receivedMessage.author.id]){
                            delkaLast[receivedMessage.author.id] = 0
                            delkaUzivatele[receivedMessage.author.id] = 0
                            pocetMereni[receivedMessage.author.id] = 0
                        }

                        delkaUzivatele[receivedMessage.author.id] = delkaLast[receivedMessage.author.id] + delka
                        delkaLast[receivedMessage.author.id] = delkaUzivatele[receivedMessage.author.id]
                        pocetMereni[receivedMessage.author.id] = pocetMereni[receivedMessage.author.id] + 1
                        
                        maxDelChannel.send(maxDelka);
                        return receivedMessage.reply(`měří obdivuhodných ${delka}`)
                    }

                    if(delka === minDelka){
                        let rolee = receivedMessage.guild.roles.cache.get("806264540001861682")
                        let roleeSpec = receivedMessage.guild.roles.cache.get("807643739102249000")

                        receivedMessage.member.roles.add(rolee).catch(console.error)

                        receivedMessage.guild.members.cache.forEach(member => {
                            member.roles.remove(roleeSpec)
                        })
                        console.log("nový člověk antirekordman")

                        talkedRecently.add(receivedMessage.author.id)
                        setTimeout(() => {
                            talkedRecently.delete(receivedMessage.author.id);
                        }, cooldown)

                        minDelka = minDelka - 1
                        console.log(`nová nejvyšší délka: ${minDelka}`)
                        receivedMessage.member.roles.add(roleeSpec).catch(console.error)

                        if(!(ids.includes(receivedMessage.author.id))){
                            ids.push(receivedMessage.author.id)
                            console.log(ids)
                        }

                        if(!delkaLast[receivedMessage.author.id] || !delkaUzivatele[receivedMessage.author.id] || !pocetMereni[receivedMessage.author.id]){
                            delkaLast[receivedMessage.author.id] = 0
                            delkaUzivatele[receivedMessage.author.id] = 0
                            pocetMereni[receivedMessage.author.id] = 0
                        }

                        delkaUzivatele[receivedMessage.author.id] = delkaLast[receivedMessage.author.id] + delka
                        delkaLast[receivedMessage.author.id] = delkaUzivatele[receivedMessage.author.id]
                        pocetMereni[receivedMessage.author.id] = pocetMereni[receivedMessage.author.id] + 1

                        minDelChannel.send(minDelka);
                        return receivedMessage.reply(`měří smutných ${delka}`)
                    }
                    
                    receivedMessage.reply(`měří asi ${delka}`)
                    console.log(`${receivedMessage.author.tag} měří ${delka} z maximálních ${maxDelka}`)
                    talkedRecently.add(receivedMessage.author.id)
                    lastMessage[receivedMessage.author.id] = now
                    setTimeout(() => {
                        talkedRecently.delete(receivedMessage.author.id);
                        console.log(cooldown)
                    }, cooldown)

                    if(!(ids.includes(receivedMessage.author.id))){
                        ids.push(receivedMessage.author.id)
                    }

                    if(!delkaLast[receivedMessage.author.id] || !delkaUzivatele[receivedMessage.author.id] || !pocetMereni[receivedMessage.author.id]){
                        delkaLast[receivedMessage.author.id] = 0
                        delkaUzivatele[receivedMessage.author.id] = 0
                        pocetMereni[receivedMessage.author.id] = 0
                    }

                    delkaUzivatele[receivedMessage.author.id] = delkaLast[receivedMessage.author.id] + delka
                    delkaLast[receivedMessage.author.id] = delkaUzivatele[receivedMessage.author.id]
                    pocetMereni[receivedMessage.author.id] = pocetMereni[receivedMessage.author.id] + 1
                }
            } else{
                receivedMessage.reply(`tahle zpráva patří do ${botRoom}`)
            }
        }
    }
    
    // hej bramborák neděláš u policie
    else if (command === 'hej'){
        if(args[0] === 'bramborák' && args[1] === 'neděláš' && args[2] === 'u' && args[3] === 'policie'){
            let helpEmbed = new Discord.MessageEmbed()
            .setTitle("Příkazy")
            .setThumbnail(client.user.avatarURL())
            .addField("ty zmrde", "neříkej mi zmrde", true)
            .addField("ty rakovino", "ale žádná rakovina to nebyla", true)
            .addField("hej bramborák", "já ti dám bramborák", true)
            .addField("poď sem", "přijdu do voice channelu", true)
            .addField("běž do prdele", "odejdu z voice channelu", true)
            .addField("hej bramborák pověz lore", "povím dlouhý příběh", true)
            .addField("hej bramborák ukaž nám ptáčka", "pošlu zajímavou fotku", true)
            .addField("ukaž rekordmany", "pošlu tabulku měřičů", true)
            .addField("kde jsi byl", "povím kde přesně jsem byl..", true)
            .addField("kde máš zuby", "..a kde mám zuby", true)
            .addField("jak řvala", "předvedu", true)
            .addField("kolik měří", "změřím tě a povím ti výsledek", true)
            .addField("co máš v popisu práce", "vypíšu různé statistiky", true)
            .addField("kde je <hledané místo>", "najdu ti místo které řekneš")
            .addField("catjam <počet>", "pošlu do chatu emote :catjam:")
            .addField("crabrave <počet>", "pošlu do chatu emote :crabrave:")
            .addField("dancingroach <počet>", "pošlu do chatu emote :dancingroach:")
            receivedMessage.channel.send('Nevím o tom teda, ale umím tohle')
            receivedMessage.channel.send(helpEmbed).catch(console.error)
        }
    }


    // maxdelka
    else if (command === 'maxdelka'){
        if(receivedMessage.author.id === '174960316868853762'){
            if(args[0] === 'přepiš'){
                maxDelka = parseInt(args[1])
                console.log(`maxdélka nyní: ${maxDelka}`)
                maxDelChannel.send(maxDelka);
            }
            else{
                console.log(`maxdélka je: ${maxDelka}`)
                receivedMessage.channel.send(`${maxDelka}`)
                maxDelChannel.send(maxDelka);
            }
        } else{
            receivedMessage.channel.send(`${maxDelka}`)
            maxDelChannel.send(maxDelka);
        }
    }

    else if (command === 'cooldown'){
        if(receivedMessage.author.id === '174960316868853762'){
            if(args[0] === 'přepiš'){
                cooldown = parseInt(args[1])
                console.log(`cooldown nyní: ${cooldown}`)
            }
            else{
                console.log(`cooldown je: ${cooldown}`)
                receivedMessage.channel.send(`${cooldown}`)
            }
        } else{
            receivedMessage.channel.send(`${cooldown}`)
        }
    }

    else if (command === 'mindelka'){
        if(receivedMessage.author.id === '174960316868853762'){
            if(args[0] === 'přepiš'){
                minDelka = parseInt(args[1])
                console.log(`mindélka nyní: ${minDelka}`)
                minDelChannel.send(minDelka);
            }
            else{
                console.log(`mindélka je: ${minDelka}`)
                receivedMessage.channel.send(`${minDelka}`)
                minDelChannel.send(minDelka);
            }
        } else{
            receivedMessage.channel.send(`${minDelka}`)
            minDelChannel.send(minDelka);
        }
    }

    else if (command === 'co'){
        if (args[0] === 'máš' && args[1] === 'v' && args[2] === 'popisu' && args[3] === 'práce'){
            let uptimeSec = (client.uptime / 1000)
            let daysUp = Math.floor(uptimeSec / 86400)
            uptimeSec %= 86400
            let hoursUp = Math.floor(uptimeSec / 3600)
            uptimeSec %= 3600
            let minsUp = Math.floor(uptimeSec / 60)
            let secsUp = Math.floor(uptimeSec % 60)

            // sorry za mou granatiku
            let daysTri = "dnů"
            let hoursTri = "hodin"
            let minsTri = "minut"
            let secsTri = "sekund"

            if (daysUp > 4){
                daysTri = "dnů"
            } else if (daysUp > 1){
                daysTri = "dny"
            } else if (daysUp > 0){
                daysTri = "den"
            }

            if (hoursUp > 4){
                hoursTri = "hodin"
            } else if(hoursUp > 1){
                hoursTri = "hodiny"
            } else if(hoursUp > 0){
                hoursTri = "hodinu"
            }

            if (minsUp > 4){
                minsTri = "minut"
            } else if(minsUp > 1){
                minsTri = "minuty"
            } else if(minsUp > 0){
                minsTri = "minutu"
            }

            if (secsUp > 4){
                secsTri = "sekund"
            } else if(secsUp > 1){
                secsTri = "sekundy"
            } else if(secsUp > 0){
                secsTri = "sekundu"
            }

            let totalUptime = (`${daysUp} ${daysTri}, ${hoursUp} ${hoursTri}, ${minsUp} ${minsTri}, ${secsUp} ${secsTri}`)

            let infoEmbed = new Discord.MessageEmbed()
                .setTitle("Informace")
                .addField("Uptime", totalUptime)
                .addField("Maxdelka", maxDelka)
                .addField("Mindelka", minDelka)
                .addField("Cooldown", `${cooldown} ms`)
                .setColor("#00D166")
            receivedMessage.channel.send(infoEmbed)
            minDelChannel.send(minDelka);
            maxDelChannel.send(maxDelka);

        }
    }

    else if (command === 'ukaž'){
            if(args[0] === 'rekordmany'){

                let rekordmanEmbed = new Discord.MessageEmbed()
                    .setTitle("Tabulka dlouhánů")
                    .setDescription("celkem nasčítaných cm; zatím neřadím podle velikosti a po restartu neukládám hodnoty!")
                    .setColor("RANDOM")
                delkaCelkem = 0
                let i = 1
                ids.forEach((number) => {
                    console.log("Number: ", number)
                    console.log(delkaLast[number])
                    //receivedMessage.channel.send("<@" + number + "> : " + delkaLast[number] +" cm")
                    delkaCelkem = delkaCelkem + delkaLast[number]

                    let uID = client.users.cache.get(number)
                    rekordmanEmbed.addField(uID.tag, "Počet měření: " + pocetMereni[number] + " | Celkem naměřeno: " + delkaLast[number] + " cm")
                    i = i + 1
                })

                rekordmanEmbed.addField("Celkem naměřeno", delkaCelkem + " cm")
                receivedMessage.channel.send(rekordmanEmbed)
                //receivedMessage.channel.send("===============================================")
            }
            else{
                receivedMessage.channel.send("nerozumím")
            }
    }

    else if (command === 'testovacicommandjakvinobrachocotoje'){
        receivedMessage.reply("jebe")
    }

    else if (command === 'jak'){
        if(args[0] === 'řvala'){
            if (receivedMessage.member.voice.channel){
                const connection = receivedMessage.member.voice.channel.join().then(connection =>{
                    const dispatcher = connection.play('./zvuky/rev.mp3')
                });
            } else {
                receivedMessage.reply("běž do voicu a já ti to ukážu")
            }
        }
    }

    else if (command === 'role'){
        if(receivedMessage.author.id === '174960316868853762'){
            var i = 0
            console.log(args[0])
            console.log(args[1])
            for(i; i < 9; i = i+2){
                //args[i] = args[i].slice(8,26)
                emojiID[i] = args[i]
                console.log(emojiID[i])
                receivedMessage.react(args[i])
                if(args[i + 2] == null){
                    break
                }
            }
            
            ii = 1
            for(ii; ii<=9; ii = ii + 2){
                role[ii] = args[ii]
                roleID[ii] = receivedMessage.guild.roles.cache.find(r => r.name === role[ii]);
                //roleID[ii] = roleID[ii].id
                console.log("coomer",roleID[ii])
                if(args[ii + 2] == null){
                    break
                }
            }
        } else {
            receivedMessage.reply("nemáš práva na tenhle příkaz")
        }
    }
})
client.login(token)



//
//
//
//
//
//
//
//
//
//
//
//
//
//          
//                  AAAA                FFFFFFFFFFFFFFFF    KKKK      KKKK
//                AAAAAAAA              FFFF                KKKK    KKKK
//              AAAA    AAAA            FFFF                KKKK  KKKK
//            AAAA        AAAA          FFFFFFFFFFFF        KKKKKKKK
//          AAAAAAAAAAAAAAAAAAAA        FFFF                KKKK  KKKK
//        AAAA                AAAA      FFFF                KKKK    KKKK
//      AAAA                    AAAA    FFFF                KKKK      KKKK
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//