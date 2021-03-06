{OVERALL_GAME_HEADER}

<!-- 
--------
-- BGA framework: © Gregory Isabelli <gisabelli@boardgamearena.com> & Emmanuel Colin <ecolin@boardgamearena.com>
-- Pitch implementation : © <Your name here> <Your email address here>
-- 
-- This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
-- See http://en.boardgamearena.com/#!doc/Studio for more information.
-------

    pitch_pitch.tpl
    
    This is the HTML template of your game.
    
    Everything you are writing in this file will be displayed in the HTML page of your game user interface,
    in the "main game zone" of the screen.
    
    You can use in this template:
    _ variables, with the format {MY_VARIABLE_ELEMENT}.
    _ HTML block, with the BEGIN/END format
    
    See your "view" PHP file to check how to set variables and control blocks
    
    Please REMOVE this comment before publishing your game on BGA
-->

<script type="text/javascript">
    //for some reason this is needed before the html renders because the variable is called when setting up the table
    // Javascript HTML templates
    var jstpl_cardontable = '<div class="cardontable" id="cardontable_${player_id}" style="background-position:-${x}px -${y}px">\
                            </div>';
    
</script>

<div id="playertables">

    <!-- BEGIN player -->
    <div class="playertable whiteblock playertable_{DIR}">
        <div class="playertablename" style="color:#{PLAYER_COLOR}">
            {PLAYER_NAME}
        </div>
        <div class="playertablecard" id="playertablecard_{PLAYER_ID}">
        </div>
    </div>
    <!-- END player -->
    <div id="trumpSuit">
        Trump Suit
        <span id="trumpSuitValue">{TRUMP_SUIT}</span>
    </div>
    <div id="bidArea" class="bidArea">
        Current Bid
        <div id="currentBid">{CURRENT_BID}</div>
    </div>
    <div class="bidText">
        How much would you like to bid?
    </div>
    <div class="bidOptions" id="bidOptions">
        <div id="pass">Pass</div>
        <div id="bid4">4</div>
        <div id="bid5">5</div>
        <div id="bid6">6</div>
        <div id="bid7">7</div>
    </div>
</div>

<div id="myhand_wrap" class="whiteblock">
    <h3>{MY_HAND}</h3>
    <div id="myhand">
    </div>
</div>

<script type="text/javascript" src= "https://code.jquery.com/jquery-3.5.1.min.js" />
<script type="text/javascript">
$.noConflict();
</script>

{OVERALL_GAME_FOOTER}
