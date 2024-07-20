"use client"
import Webcam from 'react-webcam';
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button';
import useSpeechToText from 'react-hook-speech-to-text'
import { Mic } from 'lucide-react';
import { chatSession } from '@/utils/GeminiAiModel';
import { toast } from "sonner"
import { db } from '@/utils/db';
import { UserAnswer } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import moment from 'moment';



function RecordAnsSection({MockInterviewQuestions  , activeQuestionIndex , interviewData }) {

  const [userAnswer , setUserAnswer] = useState([]);
  const {user} = useUser();
  const [loading , setLoading] = useState(false);

  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false
  });

  useEffect(()=> {
    results.map((result)=> (
      setUserAnswer(prevAns=>prevAns+result?.transcript)
    ) )
  }, [results]);

  useEffect( ()=> {
    if(!isRecording && userAnswer.length > 10){
      UpdateUserAnswer();
    }
    // if(userAnswer?.length < 10){
    //   setLoading(false);
    //   toast('Error while saving your answer , please record again');
    //   return;
    // }
  }, [userAnswer])



  const StartStopRecording = async() => {
    if(isRecording){
      setLoading(true);
      stopSpeechToText();
  
    }
    else {
      startSpeechToText();
    }
  }

  const UpdateUserAnswer = async() => {
    
    setLoading(true);
    const feedbackPrompt="Question"+MockInterviewQuestions[activeQuestionIndex]?.question+", User Answer:"+userAnswer+",Depends on question and user answer for given interview question please give us rating for answer and feedback as area of improvement if any." + "in just 5-7 lines to improve it in JSON format with rating field and feedback field.Make sure your response only have a json object and nothing else.Dont send anything else except for json , no other response nothing."

      const result = await chatSession.sendMessage(feedbackPrompt);

      const MockJsonResp=(result.response.text()).replace('```json', '').replace('```', '');
      console.log(MockJsonResp);
      const JsonFeedbackResp = JSON.parse(MockJsonResp);

      

      const resp = await db.insert(UserAnswer).values({
        mockIdRef: interviewData?.mockId,
        question: MockInterviewQuestions[activeQuestionIndex]?.question,
        correctAns: MockInterviewQuestions[activeQuestionIndex]?.answer,
        userAns:userAnswer,
        feedback:JsonFeedbackResp?.feedback,
        rating:JsonFeedbackResp?.rating,
        userEmail:user?.primaryEmailAddress?.emailAddress,
        createdAt: moment().format('DD-MM-yyyy')

      })

      if(resp){
        toast('Answer saved successfully');
        setLoading(false);
        setUserAnswer('');
        setResults([]);
      }
      setLoading(false);
      setResults([]);
      setUserAnswer('');
      
      

  }


  return (

    <div className='flex items-center justify-center flex-col'>

      <div className='flex flex-col justify-center items-center bg-black  rounded-lg p-5 mt-20'>
        <Image
          src='/webcam.png'
          width={200}
          height={200}
          className='absolute'
          alt='Webcam'
        />
        <Webcam
          mirrored={true}
          style={{
            height: 300,
            width: '100%',
            zIndex: 10,
          }}
        />
      </div>
      <Button disabled={loading} variant="outline" className="my-10" 
      onClick={ StartStopRecording}
      >
        {isRecording ?
        <h2 className='text-red-600 flex gap-2'>
          <Mic/>Stop Recording
        </h2>
        : 'Record Answer'
       }
        </Button>

      
    </div>
  )
}

export default RecordAnsSection;
