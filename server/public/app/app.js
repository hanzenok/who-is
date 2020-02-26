angular.module('app', ['ui.bootstrap'])
  .controller('ChatCtrl', ChatCtrl)
  .factory('RobotService', RobotService)
  .component('chat', {
    templateUrl: 'app/chat.tpl',
    controller: 'ChatCtrl'
  });
  
  function RobotService($http) {
    return {
      askQuestion: (question, sessionId, callback) => {
          const data = { question, sessionId }
          return $http.post('/r2d2', data, { headers: {'Content-Type': 'application/json' }});
      },
      explainResponse: (response) => {
          return $http.get(`/c3po/${response}`);
      }
    }
  }

  function ChatCtrl($scope, $sce, $timeout, RobotService) {
    $scope.question = ''
    $scope.robotThinks = false
    $scope.sessionId = uuidv4()

    $scope.askQuestion = () => {
        addMessage($scope.question, 'human')
        askRobot($scope.question)
        $scope.question = ''
    }

    $scope.messages = [
        {
            type: 'robot',
            content: $sce.trustAsHtml('<p>test1</p>')
        },
        {
            type: 'human',
            content: $sce.trustAsHtml('<p>test2</p>')
        }
    ]

    function askRobot(question) {
        $scope.robotThinks = true
        RobotService.askQuestion(question, $scope.sessionId)
          .then(response => {
            console.log('Got the response:', response)
            if (response.data === 'fallback') {
              return {data: '<p> I dont understand you man</p>'}
            }
            return RobotService.explainResponse(response.data)
          })
          .then(content => {
            console.log('Got the content', content)
            addMessage(content.data, 'robot')
          })
          .catch(error => {
            console.log('ERRORRRR', error)
            addMessage('wtf', 'robot')
          })
          .finally(() => {
            $scope.robotThinks = false
          })
    }

    function addMessage(content, type) {
        $scope.messages.push({
            type,
            content: $sce.trustAsHtml(`<p>${content}</p>`)
        })
        $timeout(() => {
            const scroll = document.getElementById('msg_history');
            scroll.scrollTop = scroll.scrollHeight;
        })
    }

    function uuidv4() {
        return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
          (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
      }
  }