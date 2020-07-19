/**
 *------
 * BGA framework: © Gregory Isabelli <gisabelli@boardgamearena.com> & Emmanuel Colin <ecolin@boardgamearena.com>
 * Pitch implementation : © <Your name here> <Your email address here>
 *
 * This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
 * See http://en.boardgamearena.com/#!doc/Studio for more information.
 * -----
 *
 * pitch.js
 *
 * Pitch user interface script
 * 
 * In this file, you are describing the logic of your user interface, in Javascript language.
 *
 */

define([
    "dojo","dojo/_base/declare",
    "ebg/core/gamegui",
    "ebg/counter",
    "ebg/stock"
],
function (dojo, declare) {
    return declare("bgagame.pitch", ebg.core.gamegui, {
        constructor: function(){
            console.log('pitch constructor');
            this.cardwidth = 72;
            this.cardheight = 96;
            // Here, you can init the global variables of your user interface
            // Example:
            // this.myGlobalValue = 0;

        },
        
        /*
            setup:
            
            This method must set up the game user interface according to current game situation specified
            in parameters.
            
            The method is called each time the game interface is displayed to a player, ie:
            _ when the game starts
            _ when a player refreshes the game page (F5)
            
            "gamedatas" argument contains all datas retrieved by your "getAllDatas" PHP method.
        */
        
        setup: function( gamedatas )
        {
            console.log( "Starting game setup" );
            
            // Setting up player boards
            for( var player_id in gamedatas.players )
            {
                var player = gamedatas.players[player_id];
            }
            
            // Player hand
            this.playerHand = new ebg.stock(); // new stock object for hand
            this.playerHand.create( this, $('myhand'), this.cardwidth, this.cardheight );
            this.playerHand.image_items_per_row = 13; // 13 images per row

            // Create cards types:
            for (var color = 1; color <= 4; color++) {
                for (var value = 2; value <= 14; value++) {
                    // Build card type id
                    var card_type_id = this.getCardUniqueId(color, value);
                    this.playerHand.addItemType(card_type_id, card_type_id, g_gamethemeurl + 'img/cards.jpg', card_type_id);
                }
            }
            //add big Joker
            var card_type_id = this.getCardUniqueId(5, 15);
            this.playerHand.addItemType(card_type_id, card_type_id, g_gamethemeurl + 'img/cards.jpg', 52);
            //add little Joker
            var card_type_id = this.getCardUniqueId(5, 16);
            this.playerHand.addItemType(card_type_id, card_type_id, g_gamethemeurl + 'img/cards.jpg', 53);

            dojo.connect( this.playerHand, 'onChangeSelection', this, 'onPlayerHandSelectionChanged' );

            // Cards in player's hand
            for ( var i in this.gamedatas.hand) {
                var card = this.gamedatas.hand[i];
                var color = card.type;
                var value = card.type_arg;
                this.playerHand.addToStockWithId(this.getCardUniqueId(color, value), card.id);
            }

            // Cards played on table
            for (i in this.gamedatas.cardsontable) {
                var card = this.gamedatas.cardsontable[i];
                var color = card.type;
                var value = card.type_arg;
                var player_id = card.location_arg;
                this.playCardOnTable(player_id, color, value, card.id);
            }
 
            //bid options
            dojo.connect($('bidOptions'), 'onclick', this, 'onBidOptionSelectionChanged');

            // Setup game notifications to handle (see "setupNotifications" method below)
            this.setupNotifications();

            console.log( "Ending game setup" );
        },
       

        ///////////////////////////////////////////////////
        //// Game & client states
        
        // onEnteringState: this method is called each time we are entering into a new game state.
        //                  You can use this method to perform some user interface changes at this moment.
        //
        onEnteringState: function( stateName, args )
        {
            console.log( 'Entering state: '+stateName );
            jQuery('.playertable').show();
            jQuery('.bidOptions, .bidText').hide();
            jQuery('#playertables').css('height','340px');
                
            switch( stateName )
            {    
                case 'playerBid':
                    //reset the bid, hide playing field, bring up bid values
                    jQuery('.playertable').hide();
                    if(this.isCurrentPlayerActive()) {
                        jQuery('.bidOptions, .bidText').show();
                    } else {
                        jQuery('.bidOptions, .bidText').hide();
                    }
                    jQuery('#playertables').css('height','200px');
                break;
                //TODO:20 for state new hand set bid amount to zero
            }
        },

        // onLeavingState: this method is called each time we are leaving a game state.
        //                 You can use this method to perform some user interface changes at this moment.
        //
        onLeavingState: function( stateName )
        {
            console.log( 'Leaving state: '+stateName );
            
            switch( stateName )
            {
            
            /* Example:
            
            case 'myGameState':
            
                // Hide the HTML block we are displaying only during this game state
                dojo.style( 'my_html_block_id', 'display', 'none' );
                
                break;
           */
           
           
            case 'dummmy':
                break;
            }               
        }, 

        // onUpdateActionButtons: in this method you can manage "action buttons" that are displayed in the
        //                        action status bar (ie: the HTML links in the status bar).
        //        
        onUpdateActionButtons: function( stateName, args )
        {
            console.log( 'onUpdateActionButtons: '+stateName );
                      
            if( this.isCurrentPlayerActive() )
            {            
                switch( stateName ) {
                    case 'pickTrump':                    
                        this.addActionButton( 'suitClubs', _('Clubs'), 'onSelectTrumpSuit' ); 
                        this.addActionButton( 'suitDiamonds', _('Diamonds'), 'onSelectTrumpSuit' ); 
                        this.addActionButton( 'suitHearts', _('Hearts'), 'onSelectTrumpSuit' ); 
                        this.addActionButton( 'suitSpades', _('Spades'), 'onSelectTrumpSuit' ); 
                        break;
                    case 'discardDown':
                        this.addActionButton( 'discardDown', _('Discard'), 'onDiscardConfirm');
                        break;
                }
            }
        },        

        ///////////////////////////////////////////////////
        //// Utility methods
        
        /*
        
            Here, you can defines some utility methods that you can use everywhere in your javascript
            script.
        
        */
        // Get card unique identifier based on its color and value
        getCardUniqueId : function(color, value) {
            return (color - 1) * 13 + (value - 2);
        },

        playCardOnTable : function(player_id, color, value, card_id) {
            // player_id => direction
            dojo.place(this.format_block('jstpl_cardontable', {
                x : this.cardwidth * (value - 2),
                y : this.cardheight * (color - 1),
                player_id : player_id
            }), 'playertablecard_' + player_id);

            if (player_id != this.player_id) {
                // Some opponent played a card
                // Move card from player panel
                this.placeOnObject('cardontable_' + player_id, 'overall_player_board_' + player_id);
            } else {
                // You played a card. If it exists in your hand, move card from there and remove
                // corresponding item

                if ($('myhand_item_' + card_id)) {
                    this.placeOnObject('cardontable_' + player_id, 'myhand_item_' + card_id);
                    this.playerHand.removeFromStockById(card_id);
                }
            }

            // In any case: move it to its final destination
            this.slideToObject('cardontable_' + player_id, 'playertablecard_' + player_id).play();
        },

        ///////////////////////////////////////////////////
        //// Player's action
        
        /*
        
            Here, you are defining methods to handle player's action (ex: results of mouse click on 
            game objects).
            
            Most of the time, these methods:
            _ check the action is possible at this game state.
            _ make a call to the game server
        
        */

        onPlayerHandSelectionChanged : function() {
            var items = this.playerHand.getSelectedItems();

            if (items.length > 0) {
                var action = 'playCard';
                if (this.checkAction(action, true)) {
                    // Can play a card
                    var card_id = items[0].id;                    
                    this.ajaxcall("/" + this.game_name + "/" + this.game_name + "/" + action + ".html", {
                        id : card_id,
                        lock : true
                    }, this, function(result) {
                    }, function(is_error) {
                    });

                    this.playerHand.unselectAll();
                } else if (this.checkAction('discardCards')) {
                    // Can give cards => let the player select some cards
                } else {
                    this.playerHand.unselectAll();
                }
            }
        },

        onBidOptionSelectionChanged : function(event) {
            var bid = event.target.innerHTML;

            if (bid == 'Pass') {
                bid = -1;
            }
            var action = 'playerBid';
            if (this.checkAction(action, true)) {
                // Can bid
                this.ajaxcall("/" + this.game_name + "/" + this.game_name + "/" + action + ".html", {
                    bidAmount : bid,
                    lock : true
                }, this, function(result) {
                }, function(is_error) {
                });
            }
        },

        onSelectTrumpSuit : function(event) {
            var suit = jQuery(event.target).attr('id').substring(4);

            var action = 'selectTrump';
            if (this.checkAction(action, true)) {
                // Can bid
                this.ajaxcall("/" + this.game_name + "/" + this.game_name + "/" + action + ".html", {
                    trumpSuit : suit,
                    lock : true
                }, this, function(result) {
                }, function(is_error) {
                });
            }
        },

        onDiscardConfirm: function(event) {
            var action = 'discardCards';
            if (this.checkAction(action, true)) {
                // Can discard
                this.ajaxcall("/" + this.game_name + "/" + this.game_name + "/" + action + ".html", {
                    cards : btoa(JSON.stringify(this.playerHand.getSelectedItems())),
                    lock : true
                }, this, function(result) {
                }, function(is_error) {
                });
            }
        },

        /* Example:
        
        onMyMethodToCall1: function( evt )
        {
            console.log( 'onMyMethodToCall1' );
            
            // Preventing default browser reaction
            dojo.stopEvent( evt );

            // Check that this action is possible (see "possibleactions" in states.inc.php)
            if( ! this.checkAction( 'myAction' ) )
            {   return; }

            this.ajaxcall( "/pitch/pitch/myAction.html", { 
                                                                    lock: true, 
                                                                    myArgument1: arg1, 
                                                                    myArgument2: arg2,
                                                                    ...
                                                                 }, 
                         this, function( result ) {
                            
                            // What to do after the server call if it succeeded
                            // (most of the time: nothing)
                            
                         }, function( is_error) {

                            // What to do after the server call in anyway (success or failure)
                            // (most of the time: nothing)

                         } );        
        },        
        
        */

        
        ///////////////////////////////////////////////////
        //// Reaction to cometD notifications

        /*
            setupNotifications:
            
            In this method, you associate each of your game notifications with your local method to handle it.
            
            Note: game notification names correspond to "notifyAllPlayers" and "notifyPlayer" calls in
                  your pitch.game.php file.
        
        */
        setupNotifications : function() {
            console.log('notifications subscriptions setup');

            dojo.subscribe('newHand', this, "notif_newHand");
            dojo.subscribe('playCard', this, "notif_playCard");
            dojo.subscribe( 'trickWin', this, "notif_trickWin" );
            dojo.subscribe( 'playerBid', this, "notif_playerBid" );
            dojo.subscribe( 'trumpSelected', this, "notif_trumpSelected" );
            dojo.subscribe( 'discardCards', this, "notif_discardCards" );
            dojo.subscribe( 'drawUp', this, "notif_drawUp" );
            this.notifqueue.setSynchronous( 'trickWin', 1000 );
            dojo.subscribe( 'giveAllCardsToPlayer', this, "notif_giveAllCardsToPlayer" );
            dojo.subscribe( 'newScores', this, "notif_newScores" );
        },

        notif_newHand : function(notif) {
            // We received a new full hand of 9 cards.
            this.playerHand.removeAll();

            for ( var i in notif.args.cards) {
                var card = notif.args.cards[i];
                var color = card.type;
                var value = card.type_arg;
                this.playerHand.addToStockWithId(this.getCardUniqueId(color, value), card.id);
            }
        },

        notif_playerBid: function(notif) {
            if(notif.args.bid_amt > 0) {
                jQuery('#currentBid').html(notif.args.bid_amt);
            }
        },

        notif_trumpSelected: function(notif) {
            jQuery('#trumpSuitValue').html(notif.args.trumpSuit);
        },

        notif_discardCards: function(notif) {
            for ( var discardedCard in notif.args.discardList) {
                this.playerHand.removeFromStockById(notif.args.discardList[discardedCard].id, 'overall_player_board_' + this.getCurrentPlayerId());
            }
        },

        notif_drawUp : function(notif) {
            for ( var i in notif.args.cards) {
                var card = notif.args.cards[i];
                var color = card.type;
                var value = card.type_arg;
                this.playerHand.addToStockWithId(this.getCardUniqueId(color, value), card.id);
            }
        },

        notif_playCard : function(notif) {
            // Play a card on the table
            this.playCardOnTable(notif.args.player_id, notif.args.color, notif.args.value, notif.args.card_id);
        },

        notif_trickWin : function(notif) {
            // We do nothing here (just wait in order players can view the 4 cards played before they're gone.
        },
        notif_giveAllCardsToPlayer : function(notif) {
            // Move all cards on table to given table, then destroy them
            var winner_id = notif.args.player_id;
            for ( var player_id in this.gamedatas.players) {
                var anim = this.slideToObject('cardontable_' + player_id, 'overall_player_board_' + winner_id);
                dojo.connect(anim, 'onEnd', function(node) {
                    dojo.destroy(node);
                });
                anim.play();
            }
        },
        notif_newScores : function(notif) {
            // Update players' scores
            for ( var player_id in notif.args.newScores) {
                this.scoreCtrl[player_id].toValue(notif.args.newScores[player_id]);
            }
        },
   });             
});
