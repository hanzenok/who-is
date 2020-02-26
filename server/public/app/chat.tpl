<div ng-controller="ChatCtrl">
  <div>
    <div class="messaging">
      <div class="inbox_msg">
        <div class="mesgs">
          <div id="msg_history">
            <div
              ng-repeat="message in messages"
              ng-class="{'robot_msg': message.type == 'robot', 'human_msg': message.type == 'human'}">
              <!-- robot message -->
              <div ng-if="message.type == 'robot'" class="robot_msg_img">
                <img src="../bot.png" alt="sunil">
              </div>
              <div ng-if="message.type == 'robot'" class="received_msg">
                <div class="received_withd_msg" ng-bind-html="message.content"></div>
              </div>
              <!-- human message -->
              <div ng-if="message.type == 'human'" class="sent_msg" ng-bind-html="message.content"></div>
            </div>
            <!-- robot thinks -->
            <div ng-if="robotThinks" class="robot_msg_img">
              <img src="../bot.png" alt="sunil" class="loading">
            </div>
            <div ng-if="robotThinks" class="received_msg">
              <div class="received_withd_msg">
                <p>Let me think ...</p>                    
              </div>
            </div>
          </div>
        </div>
        <div class="type_msg">
          <div class="input_msg_write">
            <input id="input" type="text" class="write_msg" placeholder="Type a message" ng-model="question" ng-disabled="robotThinks" ng-keyup="$event.keyCode == 13 && question ? askQuestion() : null"/>
            <button class="msg_send_btn btn btn-success" type="button" ng-click="askQuestion()" ng-disabled="!question">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>