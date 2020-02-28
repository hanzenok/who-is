angular.module('app', ['ui.bootstrap'])
  .controller('HeaderCtrl', HeaderCtrl)
  .controller('ChatCtrl', ChatCtrl)
  .controller('IntroCtrl', IntroCtrl)
  .controller('HowToUseCtrl', HowToUseCtrl)
  .controller('HowDoneCtrl', HowDoneCtrl)
  .factory('RobotService', RobotService)
  .factory('NameService', NameService)
  .component('header', {
    templateUrl: 'app/header.html',
    controller: 'HeaderCtrl'
  })
  .component('chat', {
    templateUrl: 'app/chat.html',
    controller: 'ChatCtrl'
  })
  .component('intro', {
    templateUrl: 'app/intro.html',
    controller: 'IntroCtrl'
  })
  .component('howtouse', {
    templateUrl: 'app/howtouse.html',
    controller: 'HowToUseCtrl'
  })
  .component('howdone', {
    templateUrl: 'app/howdone.html',
    controller: 'HowDoneCtrl'
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

  function NameService() {
    return {
      stop: false,
      names: [
        'Maycle',
        'Mika',
        'Mykhaelo',
        'Mykhaïlo',
        'Mykhailo',
        'Mikhailo'
      ]
    }
  }

  function HeaderCtrl($scope, $interval, NameService) {
    const { names } = NameService
    const n = names.length
    $scope.isItalic = true
    $scope.name = 'he'

    var promise = $interval(() => {
      if (NameService.stop) {
        $interval.cancel(promise)
        $scope.isItalic = false
        $scope.name = 'Mykhailo'
      } else {
        const rand = Math.floor((Math.random()*n))
        $scope.isItalic = true
        $scope.name = names[rand]
      }

    }, 4000);
  }

  function ChatCtrl($scope, $sce, $timeout, RobotService, NameService) {
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
            content: $sce.trustAsHtml(
              '<p>Hi there organic creature!</p>\
              <p>Please feel free to ask me any question. For example:\
              <ul>\
                <li>What is the surface of Earth?</li>\
                <li>What is my purpose?</li>\
                <li>etc</li>\
              </ul>\
              </p>'
            )
        }
    ]

    

    function askRobot(question) {
        $scope.robotThinks = true
        RobotService.askQuestion(question, $scope.sessionId)
          .then(response => {
            const { data: id } = response
            if (id === 'first_name') {
              NameService.stop = true
            }
            console.log('Got the response:', response)
            return RobotService.explainResponse(id)
          })
          .then(content => {
            console.log('Got the content', content)
            addMessage(content.data, 'robot')
          })
          .catch(error => {
            console.log('ERRORRRR', error)
            addMessage(
              'My circuits detected an error\
              Please come back in a minute', 'robot'
              )
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
            const input = document.getElementById('input');
            scroll.scrollTop = scroll.scrollHeight;
            input.focus();
        })
    }

    function uuidv4() {
        return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
          (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
      }
  }

  function IntroCtrl($scope, $sce, RobotService) {
    $scope.content = $sce.trustAsHtml('<i>Loading video ...</i>')
    RobotService.explainResponse('video')
      .then(response => {
        $scope.content = $sce.trustAsHtml(response.data)
      })
      .catch(error => {
        console.error(error)
        $scope.content = 'Could not load the video'
      })
  }

  function HowToUseCtrl($scope, $sce, $timeout, RobotService) {
    Promise
      .all([
        RobotService.explainResponse('howtouse_msg1'),
        RobotService.explainResponse('howtouse_msg2'),
        RobotService.explainResponse('howtouse_msg3')
      ])
      .then(values => {
        $scope.msg1 = $sce.trustAsHtml(values[0].data)
        $scope.msg2 = $sce.trustAsHtml(values[1].data)
        $scope.msg3 = $sce.trustAsHtml(values[2].data)
      })
      .catch(error => {
        console.error(error)
        $scope.msg1 = 'Something went wrong'
      })

    $scope.state = null

    $scope.answerQuestion = () => {
      const answer = $scope.answer.toLowerCase()
      // if you reading this you a real hacker
      if (
          answer.includes('statistical') &&
          answer.includes('analysis') &&
          answer.includes('data') &&
          answer.includes('reconfiguration')
      ) {
        $scope.state = 'won'
      } else {
        $scope.state = 'lost'
      }
      $timeout(() => {
        $scope.answer = ''
      })
    }
  }

  function HowDoneCtrl($scope, $sce, RobotService) {
    Promise
    .all([
      RobotService.explainResponse('howdone_msg1'),
      RobotService.explainResponse('howdone_msg2'),
    ])
    .then(values => {
      $scope.msg1 = $sce.trustAsHtml(values[0].data)
      $scope.msg2 = $sce.trustAsHtml(values[1].data)
    })
    .catch(error => {
      console.error(error)
      $scope.msg1 = 'Something went wrong'
    })
  }