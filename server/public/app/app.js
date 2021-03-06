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
  })

  const LOADING = '<i>Loading ...</i>'
  const ERROR = 'Something went wrong'

  function RobotService($http) {
    const timeout = 12000
    return {
      askQuestion: (question, sessionId) => {
        const data = { question, sessionId }
        return $http.post('/r2d2', data, {
          headers: {'Content-Type': 'application/json' },
          timeout
        })
      },
      explainResponse: (response) => {
        return $http.get(`/c3po/${response}`, { timeout })
      },
      whatToAsk: () => {
        return $http.get(`/c3po/question`, { timeout })
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
    $scope.nameUnknown = true
    $scope.name = 'he'

    var promise = $interval(() => {
      if (NameService.stop) {
        $interval.cancel(promise)
        $scope.nameUnknown = false
        $scope.name = 'Mykhailo'
      } else {
        const rand = Math.floor((Math.random()*n))
        $scope.nameUnknown = true
        $scope.name = names[rand]
      }

    }, 4000)
  }

  function ChatCtrl($scope, $sce, $timeout, RobotService, NameService) {
    $scope.question = ''
    $scope.robotThinks = false
    $scope.stop = false
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
                <li>What is the surface of the Earth?</li>\
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

          // fallback
          if (id.includes('fallback')) {
            return Promise.all([
              RobotService.explainResponse(id),
              RobotService.whatToAsk()
            ])
          }

          // other cases
          switch (id) {
            // ask robot for a question suggestion
            case 'suggest':
              return RobotService.whatToAsk()
            // end of conversation
            case 'bye':
              $scope.stop = true
            // if name asked stop blinking name
            case 'first_name':
              NameService.stop = true
            default:
              return RobotService.explainResponse(id)
          }
        })
        .then(contents => {
          if (!contents.length) contents = [ contents ]
          contents.map(content => addMessage(content.data, 'robot'))
        })
        .catch(error => {
          console.error(error)
          let errorMessage = 'My circuits detected an error.'
          if (error.status === -1) {
            errorMessage = 'Error, your request has been timed out.'
          }
          addMessage(
            errorMessage + ' Please come back in a minute',
            'robot'
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
        const scroll = document.getElementById('msg_history')
        const input = document.getElementById('input1')
        scroll.scrollTop = scroll.scrollHeight
        input.focus()
      })
    }

    function uuidv4() {
      return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
      )
    }
  }

  function IntroCtrl($scope, $sce, RobotService) {
    $scope.video = $sce.trustAsHtml('<i>Loading video ...</i>')
    $scope.msg1 = $sce.trustAsHtml(LOADING)
    Promise
      .all([
        RobotService.explainResponse('video'),
        RobotService.explainResponse('intro_msg1'),
        RobotService.explainResponse('intro_msg2')
    ])
      .then(values => {
        $scope.video = $sce.trustAsHtml(values[0].data)
        $scope.msg1 = $sce.trustAsHtml(values[1].data)
        $scope.msg2 = $sce.trustAsHtml(values[2].data)
      })
      .catch(error => {
        console.error(error)
        $scope.msg1 = ERROR
        $scope.video = null
      })
  }

  function HowToUseCtrl($scope, $sce, $timeout, RobotService) {
    $scope.msg1 = $sce.trustAsHtml(LOADING)
    $scope.nbLoss = 0
    Promise
      .all([
        RobotService.explainResponse('howtouse_msg1'),
        RobotService.explainResponse('howtouse_msg2')
      ])
      .then(values => {
        $scope.msg1 = $sce.trustAsHtml(values[0].data)
        $scope.msg2 = $sce.trustAsHtml(values[1].data)
      })
      .catch(error => {
        console.error(error)
        $scope.msg1 = ERROR
      })

    $scope.answerQuestion = () => {
      const answer = $scope.answer.toLowerCase()
      // if you reading this you a real hacker
      if (
        answer.includes('statistical') &&
        answer.includes('analysis') &&
        answer.includes('data') &&
        answer.includes('reconfiguration')
      ) {
        $scope.won = true
        $scope.msg3 = $sce.trustAsHtml(LOADING)
        RobotService.explainResponse('howtouse_msg3')
          .then((value) => {
            $scope.msg3 = $sce.trustAsHtml(value.data)
          })
          .catch(error => {
            console.error(error)
            $scope.msg3 = ERROR
          })
      } else {
        $scope.nbLoss++
        $scope.lost = true
      }
      $timeout(() => {
        $scope.answer = ''
        const input = document.getElementById('input2')
        input.focus()
      })
    }
  }

  function HowDoneCtrl($scope, $sce, RobotService) {
    $scope.msg1 = $sce.trustAsHtml(LOADING)
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
      $scope.msg1 = ERROR
    })
  }