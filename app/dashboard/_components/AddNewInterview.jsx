"use client"
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { chatSession } from '@/utils/GeminiAiModel';
import { LoaderCircle } from 'lucide-react';
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@clerk/nextjs';
import moment from 'moment';
import { useRouter } from 'next/navigation';


function AddNewInterview() {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [jobExperience, setJobExperience] = useState("");
  const [loading, setLoading] = useState(false);
  const [JsonResponse, setJsonResponse] = useState("");
  const { user } = useUser();
  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log(jobPosition, jobDesc, jobExperience);

    const InputPrompt = `Job Position: ${jobPosition}, Job Description: ${jobDesc}, Years of Experience: ${jobExperience}. Depends on Job Position, Job Description, and Years of Experience give us ${process.env.NEXT_PUBLIC_INTERVIEW_QUESTIONS_COUNT} interview questions along with Answers in JSON format. Only give a json object and there should be nothing in your response except for json object.`;

    try {
      const result = await chatSession.sendMessage(InputPrompt);
      const MockJsonResp = (await result.response.text()).replace('```json', '').replace('```', '');
      console.log(MockJsonResp);
      setJsonResponse(MockJsonResp);

      if (MockJsonResp) {
        const resp = await db.insert(MockInterview).values({
          mockId: uuidv4(),
          jsonMockResponse: MockJsonResp,
          jobPosition: jobPosition,
          jobDescription: jobDesc,
          jobExperience: jobExperience,
          createdBy: user?.primaryEmailAddress?.emailAddress,
          createdAt: moment().format('DD-MM-yyyy')
        }).returning({ mockId: MockInterview.mockId });

        console.log("Inserted Id Response:", resp);
        if(resp){
          setOpenDialog(false);
          router.push('/dashboard/interview/resp'+resp[0].mockId);
        }

        
      } else {
        console.log("No Response from Gemini");
      }
    } catch (error) {
      console.error("Error inserting into database:", error);
    }

    setLoading(false);
  };

  return (
    <div>
      <div className='p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all'
        onClick={() => setOpenDialog(true)}
      >
        <h2 className='text-lg text-center'>+ Add New</h2>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>

        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            <DialogTitle className='text-2xl'>Tell us more about your job interview</DialogTitle>
            <DialogDescription>
              <form onSubmit={onSubmit}>
                <div>
                  <h2>Add Details about your job position/role, job description, and years of experience</h2>
                  <div className='my-3 mt-7 '>
                    <label htmlFor="">Job Role / Job Position</label>
                    <Input className='mt-2' placeholder="Ex. Full stack developer" required
                      onChange={(e) => setJobPosition(e.target.value)}
                    />
                  </div>

                  <div className='my-3'>
                    <label htmlFor="">Job Description / Tech Stack (In Short)</label>
                    <Textarea className='mt-2' placeholder="Ex. React, Angular, NodeJs, MongoDB etc." required
                      onChange={(e) => setJobDesc(e.target.value)}
                    />
                  </div>

                  <div className='my-3'>
                    <label htmlFor="">Years of Experience</label>
                    <Input className='mt-2' placeholder="Ex. 5" type="number" required max="100"
                      onChange={(e) => setJobExperience(e.target.value)}
                    />
                  </div>

                </div>
                <div className='flex gap-5 mt-4 justify-end' >
                  <Button type='button' variant="ghost" onClick={() => setOpenDialog(false)} disabled={loading}>Cancel</Button>
                  <Button type='submit' disabled={loading}>
                    {loading ?
                      <>
                        <LoaderCircle className='animate-spin' />Generating from AI
                      </> : 'Start Interview'}
                  </Button>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AddNewInterview;
