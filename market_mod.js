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
			name:'Market'
		});

		new G.Tech({
			name:'market_tech',
			displayName:'Markets',
			desc:'@unlocks [trader_sell]s<>[population,Traders] can settle in a piece of [land] to buy or sell more items',
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
			'herb':{
				name:'herbs',
				icon: [4,6],
				desc:'Buy [herb]s with [market_coin].'
			},
			'food':{
				name:'food',
				icon: [3,6],
				desc:'Buy [food] with [market_coin].'
			},
			'arch_build':{
				name:'archaic materials',
				icon: [2,7],
				desc:'Buy [archaic building materials] with [market_coin].'
			},
			'base_build':{
				name:'basic materials',
				icon: [2,8],
				desc:'Buy [basic building materials] with [market_coin].'
			},
			'precious_materials':{
				name:'precious materials',
				icon: [16,8],
				desc:'Buy [precious building materials] with [market_coin].'
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
				let new_desc = buy_modes[key].desc.replace("Buy", "Sell");
				new_desc = new_desc.replace("with", "for");
				sell_modes[key] = {
					name: buy_modes[key].name,
					icon: buy_modes[key].icon,
					desc: new_desc
				}
			}
		}

		let buy_effects = [
		{
			mode:'herb',
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
			from:{'market_coin':1},
			into:{'cooked meat':1},
			every:5
		},
		{
			mode:'food',
			type:'convert',
			from:{'market_coin':1},
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
			from:{'market_coin':1},
			into:{'cooked seafood':1},
			every:5
		},
		{
			mode:'food',
			type:'convert',
			from:{'market_coin':1},
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
			from:{'market_coin':1},
			into:{'bugs':1},
			every:5,
			req:{'insects as food': 'on'}
		},
		{
			mode:'arch_build',
			type:'convert',
			from:{'market_coin':1},
			into:{'stone':1},
			every:5
		},
		{
			mode:'arch_build',
			type:'convert',
			from:{'market_coin':1},
			into:{'stick':1},
			every:5
		},
		{
			mode:'arch_build',
			type:'convert',
			from:{'market_coin':1},
			into:{'bone':1},
			every:5,
			req:{'bone-working': true}
		},
		{
			mode:'arch_build',
			type:'convert',
			from:{'market_coin':1},
			into:{'limestone':1},
			every:5
		},
		{
			mode:'arch_build',
			type:'convert',
			from:{'market_coin':1},
			into:{'mud':1},
			every:5
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
			mode:'sand',
			type:'convert',
			from:{'market_coin':1},
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
			from:{'market_coin':1},
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

		let sell_effects = [];
		for (var i = 0; i < buy_effects.length; i++) {
			sell_effects[i] = {};
			for (key in buy_effects[i]) {
				if (typeof buy_effects[i][key] !== 'object') {
					sell_effects[i][key] = buy_effects[i][key];
				}else{
					if(key == 'req'){
						sell_effects[i][key] = {'traders':true}
					}
				}
			}
			for (key in buy_effects[i].from) {
				sell_effects[i].into = {};
				sell_effects[i].into[key] = buy_effects[i].from[key];
			}
			for (key in buy_effects[i].into) {
				sell_effects[i].from = {};
				sell_effects[i].from[key] = buy_effects[i].into[key];
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

		for (var i = 0; i < buy_effects.length; i++) {
			for (key in buy_effects[i]) {
				if (key == "from" || key == "into") {
					for (subkey in buy_effects[i][key]) {
						buy_effects[i][key][subkey] = buy_effects[i][key][subkey] *10;
					}
				}
			}
		}
		for (var i = 0; i < sell_effects.length; i++) {
			for (key in sell_effects[i]) {
				if (key == "from" || key == "into") {
					for (subkey in sell_effects[i][key]) {
						sell_effects[i][key][subkey] = sell_effects[i][key][subkey] *10;
					}
				}
			}
		}
		new G.Unit({
			name:'bazaar_buy',
			displayName:'Bazaar',
			desc:'A bazaar is set in this piece of [land] to buy items in bulks of 10.',
			icon:[1,1,"market_images"],
			cost:{},
			req:{'market_tech':true},
			use:{
				'worker':1,
				'land':1,
			},
			gizmos:true,
			modes: buy_modes,
			effects: buy_effects,
			category:'market_category',
		});
		new G.Unit({
			name:'bazaar_sell',
			displayName:'Bazaar',
			desc:'A bazaar is set in this piece of [land] to sell items in bulks of 10.',
			icon:[1,1,"market_images"],
			cost:{},
			req:{'market_tech':true},
			use:{
				'worker':1,
				'land':1,
			},
			gizmos:true,
			modes: sell_modes,
			effects: sell_effects,
			category:'market_category',
		});

		new G.Unit({
			name:'market3',
			displayName:'Market',
			desc:'A [market3] is set in this piece of [land] to sell or buy 100 items at once.',
			icon:[2,1,"market_images"],
			cost:{},
			req:{'market_tech':true},
			use:{
				'worker':1,
				'land':1,
			},
			gizmos:true,
			modes:{
				'off':G.MODE_OFF,
				'buy herb':{
					name:'buy herbs',
					icon: [2,0, "market_images", 4,6],
					desc:'Buy [herb] at 1 [market_coin].'
				},
				'sell herb':{
					name:'sell herbs',
					icon: [1,0, "market_images", 4,6],
					desc:'Sell [herb] for 0.5 [market_coin].'
				},
			},
			effects:[
			{
				type:'convert',
				from:{'market_coin':100},
				into:{'herb':100},
				every:5,
				mode:'buy herb'
			},
			{
				type:'convert',
				from:{'herb':100},
				into:{'market_coin':50},
				every:5,
				mode:'sell herb'
			},
			{
				type:'mult',
				value:1.1,
				req:{
					'traders':true
				}
			}
			],
			category:'market_category',
		});
	}
});