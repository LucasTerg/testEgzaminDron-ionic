import React, { useState, useRef, useEffect } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonButton,
  IonList,
  IonItem,
  IonLabel,
  IonRadioGroup,
  IonRadio,
  IonText,
  IonFooter,
  IonProgressBar,
  IonIcon,
  IonBadge,
  IonGrid,
  IonRow,
  IonCol
} from '@ionic/react';
import { checkmarkCircle, closeCircle, refresh, arrowForward, play } from 'ionicons/icons';
import questionsData from '../data/test.json';
import './Home.css';

interface Question {
  pytanie: string;
  odpowiedzi: {
    [key: string]: string;
  };
  poprawna_odpowiedz: string;
  wyjasnienie: string;
  wyjasnienie_tabela: string;
}

const Home: React.FC = () => {
  const [started, setStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState<{ index: number; userAnswer: string }[]>([]);
  const [quizFinished, setQuizFinished] = useState(false);
  // Initialize questions state to empty array, we will populate it on startQuiz
  const [questions, setQuestions] = useState<Question[]>([]); 
  const contentRef = useRef<HTMLIonContentElement>(null);

  // Use questions state for the current question
  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    if (isSubmitted) {
      contentRef.current?.scrollToBottom(500);
    } else {
      contentRef.current?.scrollToTop(500);
    }
  }, [isSubmitted, currentQuestionIndex]);

  const startQuiz = () => {
    // Shuffle questions
    const shuffled = [...(questionsData as Question[])];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setQuestions(shuffled);
    
    setStarted(true);
    setCurrentQuestionIndex(0);
    setScore(0);
    setWrongAnswers([]);
    setQuizFinished(false);
    setIsSubmitted(false);
    setSelectedAnswer(null);
  };

  const checkAnswer = () => {
    if (!selectedAnswer) return;
    
    const isCorrect = selectedAnswer === currentQuestion.poprawna_odpowiedz;
    
    if (isCorrect) {
      setScore(score + 1);
    } else {
      setWrongAnswers([...wrongAnswers, { index: currentQuestionIndex, userAnswer: selectedAnswer }]);
    }
    setIsSubmitted(true);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setIsSubmitted(false);
    } else {
      setQuizFinished(true);
    }
  };

  const renderExplanationTable = (jsonString: string) => {
    if (!jsonString || jsonString === "null") return null;
    try {
      const data = JSON.parse(jsonString);
      if (!data || !data.explanations) return null;

      return (
        <div className="explanation-table-container">
          {Object.entries(data.explanations).map(([key, val]: [string, any]) => (
            <div key={key} className="explanation-block">
              <h4>{key}</h4>
              <p>{val.description}</p>
              {val.scenarios && (
                <div className="table-responsive">
                  <table className="explanation-table">
                    <thead>
                      <tr>
                        <th>NSTS</th>
                        <th>Limit</th>
                        <th>Typy</th>
                        <th>Info</th>
                      </tr>
                    </thead>
                    <tbody>
                      {val.scenarios.map((scenario: any, idx: number) => (
                        <tr key={idx}>
                          <td>{scenario.NSTS}</td>
                          <td>{scenario.weight_limit}</td>
                          <td>{Array.isArray(scenario.aircraft_types) ? scenario.aircraft_types.join(', ') : scenario.aircraft_types}</td>
                          <td>{scenario.additional_info}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      );
    } catch (e) {
      console.error("Error parsing explanation table", e);
      return null;
    }
  };

  const getOptionColor = (optionKey: string) => {
    if (!isSubmitted) return undefined;
    if (optionKey === currentQuestion.poprawna_odpowiedz) return 'success';
    if (optionKey === selectedAnswer) return 'danger';
    return undefined;
  };

  if (!started) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Egzamin na Drona</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding ion-text-center" fullscreen>
          <div className="welcome-container">
            <img src="assets/icon/icon.png" alt="Drone" className="welcome-icon" onError={(e) => e.currentTarget.style.display = 'none'} />
            <h1>Witaj pilocie! 🚁</h1>
            <p>Sprawdź swoją wiedzę przed oficjalnym egzaminem.</p>
            <p>Ilość pytań: <strong>{questionsData.length}</strong></p>
            <IonButton expand="block" size="large" onClick={startQuiz} className="ion-margin-top">
              <IonIcon slot="start" icon={play} />
              Rozpocznij Test
            </IonButton>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  if (quizFinished) {
    const percentage = Math.round((score / questions.length) * 100);
    const passed = percentage >= 75;

    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Wynik Egzaminu</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <div className="result-container ion-text-center">
            <IonIcon icon={passed ? checkmarkCircle : closeCircle} color={passed ? 'success' : 'danger'} size="large" style={{ fontSize: '80px' }} />
            <h2>{passed ? 'Gratulacje! Zdane! 🎉' : 'Niestety, nie tym razem. 😟'}</h2>
            <h3>Twój wynik: {score} / {questions.length} ({percentage}%)</h3>
            
            {wrongAnswers.length > 0 && (
              <div className="ion-text-start ion-margin-top">
                <h3>Błędne odpowiedzi:</h3>
                <IonList>
                  {wrongAnswers.map((item, idx) => {
                    const q = questions[item.index];
                    return (
                      <IonCard key={idx} className="wrong-answer-card">
                        <IonCardHeader>
                          <IonCardSubtitle>Pytanie {item.index + 1}</IonCardSubtitle>
                          <IonCardTitle style={{ fontSize: '1rem' }}>{q.pytanie}</IonCardTitle>
                        </IonCardHeader>
                        <IonCardContent>
                          <p className="wrong-text"><IonIcon icon={closeCircle} color="danger" /> Twoja odp: {q.odpowiedzi[item.userAnswer]} ({item.userAnswer})</p>
                          <p className="correct-text"><IonIcon icon={checkmarkCircle} color="success" /> Poprawna: {q.odpowiedzi[q.poprawna_odpowiedz]} ({q.poprawna_odpowiedz})</p>
                          {q.wyjasnienie && <p className="explanation-text">💡 {q.wyjasnienie}</p>}
                        </IonCardContent>
                      </IonCard>
                    );
                  })}
                </IonList>
              </div>
            )}

            <IonButton expand="block" onClick={startQuiz} className="ion-margin-vertical">
              <IonIcon slot="start" icon={refresh} />
              Spróbuj ponownie
            </IonButton>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Pytanie {currentQuestionIndex + 1}/{questions.length}</IonTitle>
          <IonProgressBar value={(currentQuestionIndex + 1) / questions.length}></IonProgressBar>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" ref={contentRef}>
        <IonCard>
          <IonCardHeader>
            <IonCardSubtitle>Pytanie {currentQuestionIndex + 1}</IonCardSubtitle>
            <IonCardTitle className="question-text">{currentQuestion.pytanie}</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonRadioGroup value={selectedAnswer} onIonChange={e => !isSubmitted && setSelectedAnswer(e.detail.value)}>
              {Object.entries(currentQuestion.odpowiedzi).map(([key, value]) => (
                <IonItem key={key} lines="none" className={`answer-item ${isSubmitted ? (key === currentQuestion.poprawna_odpowiedz ? 'correct-answer' : (key === selectedAnswer ? 'wrong-answer' : '')) : ''}`}>
                  <IonRadio slot="start" value={key} disabled={isSubmitted} />
                  <IonLabel className="ion-text-wrap">
                    <span className="answer-letter">{key})</span> {value}
                  </IonLabel>
                  {isSubmitted && key === currentQuestion.poprawna_odpowiedz && <IonIcon icon={checkmarkCircle} color="success" slot="end" />}
                  {isSubmitted && key === selectedAnswer && key !== currentQuestion.poprawna_odpowiedz && <IonIcon icon={closeCircle} color="danger" slot="end" />}
                </IonItem>
              ))}
            </IonRadioGroup>
          </IonCardContent>
        </IonCard>

        {isSubmitted && (
          <IonCard color={selectedAnswer === currentQuestion.poprawna_odpowiedz ? 'success' : 'light'} className="feedback-card">
            <IonCardContent>
              <IonText color={selectedAnswer === currentQuestion.poprawna_odpowiedz ? 'light' : 'dark'}>
                <strong>
                  {selectedAnswer === currentQuestion.poprawna_odpowiedz ? 'Brawo! Poprawna odpowiedź! 🎉' : `Niestety źle. Poprawna to: ${currentQuestion.poprawna_odpowiedz})`}
                </strong>
              </IonText>
              {(currentQuestion.wyjasnienie || currentQuestion.wyjasnienie_tabela) && (
                 <div className="explanation-section ion-margin-top">
                   {currentQuestion.wyjasnienie && <p>💡 {currentQuestion.wyjasnienie}</p>}
                   {renderExplanationTable(currentQuestion.wyjasnienie_tabela)}
                 </div>
              )}
            </IonCardContent>
          </IonCard>
        )}

      </IonContent>
      
      <IonFooter>
        <IonToolbar className="ion-padding-horizontal">
           {!isSubmitted ? (
             <IonButton expand="block" onClick={checkAnswer} disabled={!selectedAnswer}>
               Sprawdź
             </IonButton>
           ) : (
             <IonButton expand="block" onClick={nextQuestion} color="secondary">
               {currentQuestionIndex < questions.length - 1 ? 'Następne Pytanie' : 'Zakończ Egzamin'}
               <IonIcon slot="end" icon={arrowForward} />
             </IonButton>
           )}
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default Home;
