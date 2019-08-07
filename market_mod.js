G.AddData({
	name:'Market mod',
	author:'Bruno Mussoi Mendonça',
	desc:'Adds markets that can buy or sell items',
	engineVersion:1,
	manifest:0,
	requires:['Default dataset*'],
	sheets:{
		'market_images':'https://brunosupremo.github.io/market_mod/market_images.png'
	},
	func:function() {
		G.unitCategories.unshift({
			id:'market_category',
			name:'Trading'
		});

		new G.Tech({
			name:'market_tech',
			displayName:'Commerce',
			desc:'@unlocks [trader_sell]s<>[population,Traders] are units that can buy or sell items',
			icon:[0,0,"market_images",24,1],
			cost:{
				'insight':5,
				'culture':15
			},
			req:{'sedentism':true},
			effects:[
			{
				type:'show context',
				what:['market_category']
			}
			]
		});

		new G.Tech({
			name:'advanced catalog',
			desc:'@unlocks [bazaar_sell]s @unlocks [market_sell]s @unlocks [influence,trading policies]<>[trader_sell]s now have a more refined catalog, offering bigger control on what specific items should be traded.',
			icon:[0,1,"market_images",24,1],
			cost:{
				'insight':15,
				'culture':15
			},
			req:{'market_tech':true}
		});

		G.policyCategories.push({
            id: 'trading_policies',
            name: 'Trading'
        });

        new G.Policy({
            name: 'extended food catalog',
            desc: 'The trading options for [food] will be refined and you will be able to fine tune what item from that category you want to trade (instead of the whole category)',
            icon: [0, 0, "market_images", 3, 6],
            cost: {'influence': 2 },
            startMode: 'off',
            req: {'advanced catalog': true },
            category: 'trading_policies',
        });
        new G.Policy({
            name: 'extended archaic catalog',
            desc: 'The trading options for [archaic building materials] will be refined and you will be able to fine tune what item from that category you want to trade (instead of the whole category)',
            icon: [0, 0, "market_images", 2, 7],
            cost: {'influence': 2 },
            startMode: 'off',
            req: {'advanced catalog': true },
            category: 'trading_policies',
        });
        new G.Policy({
            name: 'extended basic catalog',
            desc: 'The trading options for [basic building materials] will be refined and you will be able to fine tune what item from that category you want to trade (instead of the whole category)',
            icon: [0, 0, "market_images", 2, 8],
            cost: {'influence': 2 },
            startMode: 'off',
            req: {'advanced catalog': true },
            category: 'trading_policies',
        });
        new G.Policy({
            name: 'extended precious catalog',
            desc: 'The trading options for [precious building materials] will be refined and you will be able to fine tune what item from that category you want to trade (instead of the whole category)',
            icon: [0, 0, "market_images", 16, 8],
            cost: {'influence': 2 },
            startMode: 'off',
            req: {'advanced catalog': true },
            category: 'trading_policies',
        });

		new G.Res({
			name:'market_coin',
			displayName:'Coins',
			desc:'Market currency used to buy and sell other goods.//Used by [population,Traders].//Can be stolen over time',
			icon:[0,0,"market_images"],
			category:'misc',
			tick:function(me,tick) {
				var toSteal=me.amount*0.01;
				G.lose(me.name,randomFloor(toSteal),'thief');
			},
		});

		new G.Trait({
			name:'traders',
			desc:'@Your people learn the tricks of trading, prices get 10% better, for both buying and selling',
			icon:[0,1,"market_images",24,1],
			chance:20,
			cost: {
				'culture': 15
			},
			req:{'sedentism':true},
		});

		let buy_modes = {
			'off':G.MODE_OFF,
			'food':{
				name:'Food (all)',
				icon: [3,6],
				desc:'Buy [food] with [market_coin].<>Includes [herb], [fruit], [meat], [cooked meat], [cured meat], [seafood], [cooked seafood], [cured seafood], [bread] and [bugs] (when allowed as food)'
			},
			'herb':{
				name:'Herb',
				icon: [4,6],
				desc:'Buy [herb]s with [market_coin].',
				req:{'extended food catalog': 'on'}
			},
			'fruit':{
				name:'Fruit',
				icon: [4,7],
				desc:'Buy [fruit] with [market_coin].',
				req:{'extended food catalog': 'on'}
			},
			'meat':{
				name:'Meat',
				icon: [5,7],
				desc:'Buy [meat] with [market_coin].',
				req:{'extended food catalog': 'on'}
			},
			'cooked meat':{
				name:'Cooked meat',
				icon: [6,7],
				desc:'Buy [cooked meat] with [market_coin].',
				req:{'extended food catalog': 'on'}
			},
			'cured meat':{
				name:'Cured meat',
				icon: [11,6],
				desc:'Buy [cured meat] with [market_coin].',
				req:{'extended food catalog': 'on'}
			},
			'seafood':{
				name:'Seafood',
				icon: [5,6],
				desc:'Buy [seafood] with [market_coin].',
				req:{'extended food catalog': 'on'}
			},
			'cooked seafood':{
				name:'Cooked seafood',
				icon: [6,6],
				desc:'Buy [cooked seafood] with [market_coin].',
				req:{'extended food catalog': 'on'}
			},
			'cured seafood':{
				name:'Cured seafood',
				icon: [12,6],
				desc:'Buy [cured seafood] with [market_coin].',
				req:{'extended food catalog': 'on'}
			},
			'bread':{
				name:'Bread',
				icon: [7,7],
				desc:'Buy [bread]s with [market_coin].',
				req:{'extended food catalog': 'on'}
			},
			'bugs':{
				name:'Bugs',
				icon: [8,11],
				desc:'Buy [bugs] with [market_coin].',
				req:{'extended food catalog': 'on' }
			},
			'arch_build':{
				name:'Archaic materials (all)',
				icon: [2,7],
				desc:'Buy [archaic building materials] with [market_coin].<>Includes [stone], [stick], [limestone], [mud] and [bone] (if bone-working is researched)'
			},
			'stone':{
				name:'Stone',
				icon: [2,6],
				desc:'Buy [stone] with [market_coin].',
				req:{'extended archaic catalog': 'on' }
			},
			'stick':{
				name:'Stick',
				icon: [0,6],
				desc:'Buy [stick] with [market_coin].',
				req:{'extended archaic catalog': 'on' }
			},
			'limestone':{
				name:'Limestone',
				icon: [6,8],
				desc:'Buy [limestone] with [market_coin].',
				req:{'extended archaic catalog': 'on' }
			},
			'mud':{
				name:'Mud',
				icon: [0,7],
				desc:'Buy [mud] with [market_coin].',
				req:{'extended archaic catalog': 'on' }
			},
			'bone':{
				name:'Bone',
				icon: [8,7],
				desc:'Buy [bone] with [market_coin].',
				req:{'extended archaic catalog': 'on' }
			},
			'base_build':{
				name:'Basic materials (all)',
				icon: [2,8],
				desc:'Buy [basic building materials] with [market_coin].<>Includes [cut stone], [log], [lumber], and [brick]'
			},
			'cut stone':{
				name:'Cut stone',
				icon: [0,8],
				desc:'Buy [cut stone] with [market_coin].',
				req:{'extended basic catalog': 'on' }
			},
			'log':{
				name:'Log',
				icon: [1,6],
				desc:'Buy [log] with [market_coin].',
				req:{'extended basic catalog': 'on' }
			},
			'lumber':{
				name:'Lumber',
				icon: [1,8],
				desc:'Buy [lumber] with [market_coin].',
				req:{'extended basic catalog': 'on' }
			},
			'brick':{
				name:'Brick',
				icon: [3,8],
				desc:'Buy [brick] with [market_coin].',
				req:{'extended basic catalog': 'on' }
			},
			'precious_materials':{
				name:'Precious materials (all)',
				icon: [16,8],
				desc:'Buy [precious building materials] with [market_coin].<>Includes [marble], [gold block] and [gem block]'
			},
			'marble':{
				name:'Marble',
				icon: [7,8],
				desc:'Buy [marble] with [market_coin].',
				req:{'extended precious catalog': 'on' }
			},
			'gold block':{
				name:'Gold block',
				icon: [14,8],
				desc:'Buy [gold block] with [market_coin].',
				req:{'extended precious catalog': 'on' }
			},
			'gem block':{
				name:'Gem block',
				icon: [17,8],
				desc:'Buy [gem block] with [market_coin].',
				req:{'extended precious catalog': 'on' }
			},
			'sand':{
				name:'sand',
				icon: [4,9],
				desc:'Buy [sand] with [market_coin].'
			},
			'leather':{
				name:'leather',
				icon: [10,7],
				desc:'Buy [leather] with [market_coin].'
			},
			'basic clothes':{
				name:'basic clothes',
				icon: [16,7],
				desc:'Buy [basic clothes] with [market_coin].'
			},
			'salt':{
				name:'salt',
				icon: [11,7],
				desc:'Buy [salt] with [market_coin].'
			},
			'pot':{
				name:'pot',
				icon: [13,5],
				desc:'Buy [pot] with [market_coin].'
			},
		};
		let sell_modes = {};
		for (key in buy_modes) {
			if (key == 'off') {
				sell_modes[key] = G.MODE_OFF;
			}else{
				let new_desc = buy_modes[key].desc.replace("Buy ", "Sell ");
				new_desc = new_desc.replace(" with ", " for ");
				sell_modes[key] = {
					name: buy_modes[key].name,
					icon: buy_modes[key].icon,
					desc: new_desc
				}
				if (buy_modes[key].req){
					sell_modes[key].req = buy_modes[key].req;
				}
			}
		}

		let buy_effects = [
		{
			mode:'food',
			type:'convert',
			from:{'market_coin':1},
			into:{'herb':1},
			every:5
		},
		{
			mode:'food',
			type:'convert',
			from:{'market_coin':1},
			into:{'fruit':1},
			every:5
		},
		{
			mode:'food',
			type:'convert',
			from:{'market_coin':1},
			into:{'meat':1},
			every:5
		},
		{
			mode:'food',
			type:'convert',
			from:{'market_coin':2},
			into:{'cooked meat':1},
			every:5
		},
		{
			mode:'food',
			type:'convert',
			from:{'market_coin':2},
			into:{'cured meat':1},
			every:5
		},
		{
			mode:'food',
			type:'convert',
			from:{'market_coin':1},
			into:{'seafood':1},
			every:5
		},
		{
			mode:'food',
			type:'convert',
			from:{'market_coin':2},
			into:{'cooked seafood':1},
			every:5
		},
		{
			mode:'food',
			type:'convert',
			from:{'market_coin':2},
			into:{'cured seafood':1},
			every:5
		},
		{
			mode:'food',
			type:'convert',
			from:{'market_coin':1},
			into:{'bread':1},
			every:5
		},
		{
			mode:'food',
			type:'convert',
			from:{'market_coin':0.5},
			into:{'bugs':1},
			every:5,
			req:{'insects as food': 'on'}
		},
		{
			mode:'herb',
			type:'convert',
			from:{'market_coin':1},
			into:{'herb':1},
			every:5,
			req:{'advanced catalog': true}
		},
		{
			mode:'fruit',
			type:'convert',
			from:{'market_coin':1},
			into:{'fruit':1},
			every:5,
			req:{'advanced catalog': true}
		},
		{
			mode:'meat',
			type:'convert',
			from:{'market_coin':1},
			into:{'meat':1},
			every:5,
			req:{'advanced catalog': true}
		},
		{
			mode:'cooked meat',
			type:'convert',
			from:{'market_coin':2},
			into:{'cooked meat':1},
			every:5,
			req:{'advanced catalog': true}
		},
		{
			mode:'cured meat',
			type:'convert',
			from:{'market_coin':2},
			into:{'cured meat':1},
			every:5,
			req:{'advanced catalog': true}
		},
		{
			mode:'seafood',
			type:'convert',
			from:{'market_coin':1},
			into:{'seafood':1},
			every:5,
			req:{'advanced catalog': true}
		},
		{
			mode:'cooked seafood',
			type:'convert',
			from:{'market_coin':2},
			into:{'cooked seafood':1},
			every:5,
			req:{'advanced catalog': true}
		},
		{
			mode:'cured seafood',
			type:'convert',
			from:{'market_coin':2},
			into:{'cured seafood':1},
			every:5,
			req:{'advanced catalog': true}
		},
		{
			mode:'bread',
			type:'convert',
			from:{'market_coin':1},
			into:{'bread':1},
			every:5,
			req:{'advanced catalog': true}
		},
		{
			mode:'bugs',
			type:'convert',
			from:{'market_coin':0.5},
			into:{'bugs':1},
			every:5,
			req:{'advanced catalog': true }
		},
		{
			mode:'arch_build',
			type:'convert',
			from:{'market_coin':0.5},
			into:{'stone':1},
			every:5
		},
		{
			mode:'arch_build',
			type:'convert',
			from:{'market_coin':0.5},
			into:{'stick':1},
			every:5
		},
		{
			mode:'arch_build',
			type:'convert',
			from:{'market_coin':0.5},
			into:{'bone':1},
			every:5,
			req:{'bone-working': true}
		},
		{
			mode:'arch_build',
			type:'convert',
			from:{'market_coin':0.5},
			into:{'limestone':1},
			every:5
		},
		{
			mode:'arch_build',
			type:'convert',
			from:{'market_coin':0.5},
			into:{'mud':1},
			every:5
		},
		{
			mode:'stone',
			type:'convert',
			from:{'market_coin':0.5},
			into:{'stone':1},
			every:5,
			req:{'advanced catalog': true}
		},
		{
			mode:'stick',
			type:'convert',
			from:{'market_coin':0.5},
			into:{'stick':1},
			every:5,
			req:{'advanced catalog': true}
		},
		{
			mode:'bone',
			type:'convert',
			from:{'market_coin':0.5},
			into:{'bone':1},
			every:5,
			req:{'advanced catalog': true }
		},
		{
			mode:'limestone',
			type:'convert',
			from:{'market_coin':0.5},
			into:{'limestone':1},
			every:5,
			req:{'advanced catalog': true}
		},
		{
			mode:'mud',
			type:'convert',
			from:{'market_coin':0.5},
			into:{'mud':1},
			every:5,
			req:{'advanced catalog': true}
		},
		{
			mode:'base_build',
			type:'convert',
			from:{'market_coin':1},
			into:{'cut stone':1},
			every:5
		},
		{
			mode:'base_build',
			type:'convert',
			from:{'market_coin':1},
			into:{'log':1},
			every:5
		},
		{
			mode:'base_build',
			type:'convert',
			from:{'market_coin':1},
			into:{'lumber':1},
			every:5
		},
		{
			mode:'base_build',
			type:'convert',
			from:{'market_coin':1},
			into:{'brick':1},
			every:5
		},
		{
			mode:'cut stone',
			type:'convert',
			from:{'market_coin':0.5},
			into:{'cut stone':1},
			every:5,
			req:{'advanced catalog': true}
		},
		{
			mode:'log',
			type:'convert',
			from:{'market_coin':0.5},
			into:{'log':1},
			every:5,
			req:{'advanced catalog': true}
		},
		{
			mode:'lumber',
			type:'convert',
			from:{'market_coin':0.5},
			into:{'lumber':1},
			every:5,
			req:{'advanced catalog': true}
		},
		{
			mode:'brick',
			type:'convert',
			from:{'market_coin':0.5},
			into:{'brick':1},
			every:5,
			req:{'advanced catalog': true}
		},
		{
			mode:'precious_materials',
			type:'convert',
			from:{'market_coin':1},
			into:{'marble':1},
			every:5,
		},
		{
			mode:'precious_materials',
			type:'convert',
			from:{'market_coin':1},
			into:{'gold block':1},
			every:5,
		},
		{
			mode:'precious_materials',
			type:'convert',
			from:{'market_coin':1},
			into:{'gem block':1},
			every:5,
		},
		{
			mode:'marble',
			type:'convert',
			from:{'market_coin':0.5},
			into:{'marble':1},
			every:5,
			req:{'advanced catalog': true}
		},
		{
			mode:'gold block',
			type:'convert',
			from:{'market_coin':0.5},
			into:{'gold block':1},
			every:5,
			req:{'advanced catalog': true}
		},
		{
			mode:'gem block',
			type:'convert',
			from:{'market_coin':0.5},
			into:{'gem block':1},
			every:5,
			req:{'advanced catalog': true}
		},
		{
			mode:'sand',
			type:'convert',
			from:{'market_coin':0.5},
			into:{'sand':1},
			every:5,
		},
		{
			mode:'leather',
			type:'convert',
			from:{'market_coin':1},
			into:{'leather':1},
			every:5,
		},
		{
			mode:'basic clothes',
			type:'convert',
			from:{'market_coin':2},
			into:{'basic clothes':1},
			every:5,
		},
		{
			mode:'salt',
			type:'convert',
			from:{'market_coin':1},
			into:{'salt':1},
			every:5,
		},
		{
			mode:'pot',
			type:'convert',
			from:{'market_coin':1},
			into:{'pot':1},
			every:5,
		},
		{
			type:'mult',
			value:1.1,
			req:{
				'traders':true
			}
		}
		];

		let sell_effects	= [];
		let sell_effects10	= [];
		let sell_effects100	= [];
		let buy_effects10	= [];
		let buy_effects100	= [];
		for (var i = 0; i < buy_effects.length; i++) {
			sell_effects[i]		= {};
			sell_effects10[i]	= {};
			sell_effects100[i]	= {};
			buy_effects10[i]	= {};
			buy_effects100[i]	= {};
			for (key in buy_effects[i]) {
				if (typeof buy_effects[i][key] !== 'object') {
					sell_effects[i][key]	= buy_effects[i][key];
					sell_effects10[i][key]	= buy_effects[i][key];
					sell_effects100[i][key]	= buy_effects[i][key];
					buy_effects10[i][key]	= buy_effects[i][key];
					buy_effects100[i][key]	= buy_effects[i][key];
				}else{
					if(key == 'req'){
						sell_effects[i].req		= {};
						sell_effects10[i].req	= {};
						sell_effects100[i].req	= {};
						buy_effects10[i].req	= {};
						buy_effects100[i].req	= {};
						for (reqkey in buy_effects[i].req) {
							sell_effects[i].req[reqkey]		= buy_effects[i].req[reqkey];
							sell_effects10[i].req[reqkey]	= buy_effects[i].req[reqkey];
							sell_effects100[i].req[reqkey]	= buy_effects[i].req[reqkey];
							buy_effects10[i].req[reqkey]	= buy_effects[i].req[reqkey];
							buy_effects100[i].req[reqkey]	= buy_effects[i].req[reqkey];
						}
					}
				}
			}
			for (key in buy_effects[i].from) {
				sell_effects[i].into	= {};
				sell_effects10[i].into	= {};
				sell_effects100[i].into	= {};
				buy_effects10[i].from	= {};
				buy_effects100[i].from	= {};
				sell_effects[i].into[key] 		= buy_effects[i].from[key] /2;
				sell_effects10[i].into[key]		= buy_effects[i].from[key] *5;
				sell_effects100[i].into[key]	= buy_effects[i].from[key] *50;
				buy_effects10[i].from[key]		= buy_effects[i].from[key] *10;
				buy_effects100[i].from[key]		= buy_effects[i].from[key] *100;
			}
			for (key in buy_effects[i].into) {
				sell_effects[i].from 	= {};
				sell_effects10[i].from	= {};
				sell_effects100[i].from	= {};
				buy_effects10[i].into	= {};
				buy_effects100[i].into	= {};
				sell_effects[i].from[key] 		= buy_effects[i].into[key];
				sell_effects10[i].from[key]		= buy_effects[i].into[key] *10;
				sell_effects100[i].from[key]	= buy_effects[i].into[key] *100;
				buy_effects10[i].into[key]		= buy_effects[i].into[key] *10;
				buy_effects100[i].into[key]		= buy_effects[i].into[key] *100;
			}
		}

		new G.Unit({
			name:'trader_buy',
			displayName:'Trader',
			desc:'A [population, Trader] that can buy items.',
			icon:[2,0,"market_images", 0,1,"market_images"],
			cost:{},
			req:{'market_tech':true},
			use:{
				'worker':1,
			},
			gizmos:true,
			modes: buy_modes,
			effects: buy_effects,
			category:'market_category',
		});
		new G.Unit({
			name:'trader_sell',
			displayName:'Trader',
			desc:'A [population, Trader] that can sell items.',
			icon:[1,0,"market_images", 0,1,"market_images"],
			cost:{},
			req:{'market_tech':true},
			use:{
				'worker':1,
			},
			gizmos:true,
			modes: sell_modes,
			effects: sell_effects,
			category:'market_category',
		});

		new G.Unit({
			name:'bazaar_buy',
			displayName:'Bazaar',
			desc:'A bazaar is set in this piece of [land] to buy items in bulks of 10.',
			icon:[2,0,"market_images", 1,1,"market_images"],
			cost:{},
			req:{
				'market_tech':true,
				'advanced catalog':true,
			},
			use:{
				'worker':1,
				'land':1,
			},
			gizmos:true,
			modes: buy_modes,
			effects: buy_effects10,
			category:'market_category',
		});
		new G.Unit({
			name:'bazaar_sell',
			displayName:'Bazaar',
			desc:'A bazaar is set in this piece of [land] to sell items in bulks of 10.',
			icon:[1,0,"market_images", 1,1,"market_images"],
			cost:{},
			req:{
				'market_tech':true,
				'advanced catalog':true,
			},
			use:{
				'worker':1,
				'land':1,
			},
			gizmos:true,
			modes: sell_modes,
			effects: sell_effects10,
			category:'market_category',
		});

		new G.Unit({
			name:'market_buy',
			displayName:'Market',
			desc:'A market is set in this piece of [land] to buy 100 items at once.',
			icon:[2,0,"market_images", 2,1,"market_images"],
			cost:{},
			req:{
				'market_tech':true,
				'advanced catalog':true,
			},
			use:{
				'worker':2,
				'land':1,
			},
			gizmos:true,
			modes: buy_modes,
			effects: buy_effects100,
			category:'market_category',
		});
		new G.Unit({
			name:'market_sell',
			displayName:'Market',
			desc:'A market is set in this piece of [land] to sell 100 items at once.',
			icon:[1,0,"market_images", 2,1,"market_images"],
			cost:{},
			req:{
				'market_tech':true,
				'advanced catalog':true,
			},
			use:{
				'worker':2,
				'land':1,
			},
			gizmos:true,
			modes: sell_modes,
			effects: sell_effects100,
			category:'market_category',
		});
	}
});