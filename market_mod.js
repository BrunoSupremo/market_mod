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

		new G.Tech({
			name:'advanced catalog',
			desc:'[trader_sell] now have a more refined catalog, offering bigger control on what specific items should be traded.',
			icon:[0,1,"market_images",24,1],
			cost:{
				'insight':15,
				'culture':15
			},
			req:{'market_tech':true}
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
				desc:'Buy [food] with [market_coin].//Includes [herb], [fruit], [meat], [cooked meat], [cured meat], [seafood], [cooked seafood], [cured seafood], [bread] and [bugs] (when allowed as food)'
			},
			'herb':{
				name:'Herb',
				icon: [4,6],
				desc:'Buy [herb]s with [market_coin].',
				req:{'advanced catalog': true}
			},
			'fruit':{
				name:'Fruit',
				icon: [4,7],
				desc:'Buy [fruit] with [market_coin].',
				req:{'advanced catalog': true}
			},
			'meat':{
				name:'Meat',
				icon: [5,7],
				desc:'Buy [meat] with [market_coin].',
				req:{'advanced catalog': true}
			},
			'cooked meat':{
				name:'Cooked meat',
				icon: [6,7],
				desc:'Buy [cooked meat] with [market_coin].',
				req:{'advanced catalog': true}
			},
			'cured meat':{
				name:'Cured meat',
				icon: [11,6],
				desc:'Buy [cured meat] with [market_coin].',
				req:{'advanced catalog': true}
			},
			'seafood':{
				name:'Seafood',
				icon: [5,6],
				desc:'Buy [seafood] with [market_coin].',
				req:{'advanced catalog': true}
			},
			'cooked seafood':{
				name:'Cooked seafood',
				icon: [6,6],
				desc:'Buy [cooked seafood] with [market_coin].',
				req:{'advanced catalog': true}
			},
			'cured seafood':{
				name:'Cured seafood',
				icon: [12,6],
				desc:'Buy [cured seafood] with [market_coin].',
				req:{'advanced catalog': true}
			},
			'bread':{
				name:'Bread',
				icon: [7,7],
				desc:'Buy [bread]s with [market_coin].',
				req:{'advanced catalog': true}
			},
			'bugs':{
				name:'Bugs',
				icon: [8,11],
				desc:'Buy [bugs] with [market_coin].',,
				req:{
					'advanced catalog': true,
					'insects as food': 'on'
				}
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
				let new_desc = buy_modes[key].desc.replace("Buy ", "Sell ");
				new_desc = new_desc.replace(" with ", " for ");
				sell_modes[key] = {
					name: buy_modes[key].name,
					icon: buy_modes[key].icon,
					desc: new_desc
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
			req:{
				'advanced catalog': true,
				'insects as food': 'on'
			}
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
						sell_effects[i][key]	= {'traders':true};
						sell_effects10[i][key]	= {'traders':true};
						sell_effects100[i][key]	= {'traders':true};
						buy_effects10[i][key]	= {'traders':true};
						buy_effects100[i][key]	= {'traders':true};
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
			req:{'market_tech':true},
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
			req:{'market_tech':true},
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
			req:{'market_tech':true},
			use:{
				'worker':1,
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
			req:{'market_tech':true},
			use:{
				'worker':1,
				'land':1,
			},
			gizmos:true,
			modes: sell_modes,
			effects: sell_effects100,
			category:'market_category',
		});
	}
});