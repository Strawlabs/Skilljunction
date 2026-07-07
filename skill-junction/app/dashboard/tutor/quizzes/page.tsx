'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import DataTable, { Column } from '@/components/ui/DataTable'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import GlassCard from '@/components/ui/GlassCard'

interface QuizRecord {
  id: string
  title: string
  course_title: string
  questions_count: number
}

interface QuestionInput {
  question_text: string
  options: string[]
  correct_answer: string
}

export default function TutorQuizzesPage() {
  const [quizzes, setQuizzes] = useState<QuizRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [courses, setCourses] = useState<{ id: string; title: string }[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  // Form fields
  const [title, setTitle] = useState('')
  const [selectedCourseId, setSelectedCourseId] = useState('')
  const [questions, setQuestions] = useState<QuestionInput[]>([
    { question_text: '', options: ['', '', '', ''], correct_answer: '' }
  ])

  const supabase = createClient()

  async function loadQuizzesData() {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Fetch quizzes created by user
      const { data: quizData } = await supabase
        .from('quizzes')
        .select(`
          id,
          title,
          courses:course_id (title)
        `)
        .eq('created_by', user.id)

      // Fetch questions counts
      const { data: questionsData } = await supabase
        .from('quiz_questions')
        .select('quiz_id')

      if (quizData) {
        const mapped: QuizRecord[] = quizData.map((q: any) => {
          const qCount = (questionsData || []).filter(qd => qd.quiz_id === q.id).length
          return {
            id: q.id,
            title: q.title,
            course_title: q.courses?.title || 'General Course',
            questions_count: qCount
          }
        })
        setQuizzes(mapped)
      }

      // Fetch tutor's courses for dropdown
      const { data: tutorCourses } = await supabase
        .from('courses')
        .select('id, title')
        .eq('tutor_id', user.id)

      if (tutorCourses) setCourses(tutorCourses)

    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadQuizzesData()
  }, [])

  const handleAddQuestionField = () => {
    setQuestions(prev => [...prev, { question_text: '', options: ['', '', '', ''], correct_answer: '' }])
  }

  const handleQuestionChange = (index: number, field: string, value: any) => {
    setQuestions(prev => {
      const list = [...prev]
      if (field === 'question_text') {
        list[index].question_text = value
      } else if (field === 'correct_answer') {
        list[index].correct_answer = value
      }
      return list
    })
  }

  const handleOptionChange = (qIndex: number, optIndex: number, value: string) => {
    setQuestions(prev => {
      const list = [...prev]
      list[qIndex].options[optIndex] = value
      return list
    })
  }

  const handleSaveQuiz = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !selectedCourseId) return
    setSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // 1. Insert quiz header
      const { data: newQuiz, error: quizErr } = await supabase
        .from('quizzes')
        .insert({
          title,
          course_id: selectedCourseId,
          created_by: user.id
        })
        .select()
        .single()

      if (quizErr) throw quizErr

      // 2. Insert questions
      if (newQuiz && questions.length > 0) {
        const questionsToInsert = questions
          .filter(q => q.question_text.trim() !== '')
          .map(q => ({
            quiz_id: newQuiz.id,
            question_text: q.question_text,
            options: q.options,
            correct_answer: q.correct_answer || q.options[0]
          }))

        if (questionsToInsert.length > 0) {
          const { error: questErr } = await supabase
            .from('quiz_questions')
            .insert(questionsToInsert)

          if (questErr) throw questErr
        }
      }

      setModalOpen(false)
      setTitle('')
      setSelectedCourseId('')
      setQuestions([{ question_text: '', options: ['', '', '', ''], correct_answer: '' }])
      loadQuizzesData()
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const columns: Column<QuizRecord>[] = [
    { key: 'title', header: 'Quiz Title', sortable: true },
    { key: 'course_title', header: 'Associated Course', sortable: true },
    {
      key: 'questions_count',
      header: 'Total Questions',
      sortable: true,
      render: (row) => <Badge variant="primary">{row.questions_count} questions</Badge>
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold text-on-surface">Quiz Studio</h2>
          <p className="text-sm text-on-surface-variant mt-1">
            Author and assign dynamic tests to your active courses.
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-on-primary font-semibold rounded-xl hover:opacity-90 shadow-md shadow-primary/20 transition-all active:scale-95 text-xs w-full md:w-auto"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          Create New Quiz
        </button>
      </div>

      {/* Main Table */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6 shadow-sm">
        <h3 className="text-lg font-bold text-on-surface mb-6">Quiz Repository</h3>
        <DataTable
          columns={columns}
          data={quizzes}
          keyField="id"
          pageSize={10}
          loading={loading}
          emptyMessage="No quizzes created yet. Click 'Create New Quiz' to build one."
        />
      </div>

      {/* Create Quiz Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create New Quiz"
        size="lg"
        actions={
          <>
            <button
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-on-surface-variant hover:bg-surface-container rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveQuiz}
              disabled={saving || !title || !selectedCourseId}
              className="px-5 py-2.5 bg-primary text-on-primary text-xs font-semibold rounded-xl hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {saving ? 'Saving...' : 'Save & Publish'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSaveQuiz} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-on-surface-variant">Quiz Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Loops & Logic Check"
                className="w-full px-4 py-2.5 bg-surface border border-outline-variant/60 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-on-surface-variant">Target Course</label>
              <select
                required
                value={selectedCourseId}
                onChange={e => setSelectedCourseId(e.target.value)}
                className="w-full px-4 py-2.5 bg-surface border border-outline-variant/60 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none"
              >
                <option value="">Select Course...</option>
                {courses.map(c => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Questions Editor Section */}
          <div className="space-y-4 pt-4 border-t border-outline-variant/20">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-bold text-on-surface">Quiz Questions</h4>
              <button
                type="button"
                onClick={handleAddQuestionField}
                className="text-primary text-xs font-bold flex items-center gap-1 hover:underline"
              >
                <span className="material-symbols-outlined text-sm">add</span> Add Question
              </button>
            </div>

            <div className="space-y-6 max-h-72 overflow-y-auto pr-2">
              {questions.map((q, qIdx) => (
                <div key={qIdx} className="bg-surface-container-low p-4 rounded-xl space-y-3 border border-outline-variant/30">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-on-surface-variant">Question {qIdx + 1}</label>
                    <input
                      type="text"
                      required
                      value={q.question_text}
                      onChange={e => handleQuestionChange(qIdx, 'question_text', e.target.value)}
                      placeholder="e.g. What is the output of print(2**3)?"
                      className="w-full px-4 py-2 bg-surface border border-outline-variant/40 rounded-xl text-xs focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {q.options.map((opt, oIdx) => (
                      <div key={oIdx} className="space-y-1">
                        <label className="text-[10px] text-on-surface-variant font-semibold">Option {String.fromCharCode(65 + oIdx)}</label>
                        <input
                          type="text"
                          required
                          value={opt}
                          onChange={e => handleOptionChange(qIdx, oIdx, e.target.value)}
                          placeholder={`Option ${oIdx + 1}`}
                          className="w-full px-3 py-1.5 bg-surface border border-outline-variant/40 rounded-lg text-xs focus:ring-2 focus:ring-primary outline-none"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="space-y-1 pt-1">
                    <label className="text-xs font-semibold text-on-surface-variant">Correct Option Answer</label>
                    <input
                      type="text"
                      required
                      value={q.correct_answer}
                      onChange={e => handleQuestionChange(qIdx, 'correct_answer', e.target.value)}
                      placeholder="Copy exact text of correct option here..."
                      className="w-full px-4 py-2 bg-surface border border-outline-variant/40 rounded-xl text-xs focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </form>
      </Modal>
    </div>
  )
}
