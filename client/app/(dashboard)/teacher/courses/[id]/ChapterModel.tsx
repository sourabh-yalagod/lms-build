'use client';
import { CustomFormField } from '@/components/CustomFormField';
import CustomModal from '@/components/CustomModel';
import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ChapterFormData, chapterSchema } from '@/lib/schemas';
import { addChapter, closeChapterModal, editChapter } from '@/state';
import { useAppDispatch, useAppSelector } from '@/state/redux';
import { zodResolver } from '@hookform/resolvers/zod';
import { randomUUID } from 'crypto';
import { X } from 'lucide-react';
import React from 'react';
import { Form, useForm } from 'react-hook-form';
import { toast } from 'sonner';

const ChapterModel = () => {
  const {
    isChapterModalOpen,
    sections,
    selectedChapterIndex,
    selectedSectionIndex,
  } = useAppSelector((state) => state.global.courseEditor);

  const chapter: Chapter | undefined =
    selectedChapterIndex !== null && selectedSectionIndex !== null
      ? sections[selectedSectionIndex].chapters[selectedChapterIndex]
      : undefined;
  const dispatch = useAppDispatch();

  const closeModel = () => {
    dispatch(closeChapterModal());
  };

  const methods = useForm({
    resolver: zodResolver(chapterSchema),
    defaultValues: {
      title: '',
      content: '',
      video: '',
    },
  });

  const onSubmit = (data: ChapterFormData) => {
    console.log('Section Model : ', data);
    const newChapter: Chapter = {
      chapterId: chapter?.chapterId || randomUUID(),
      title: data.title,
      content: data.content,
      type: data.video ? 'Video' : 'Text',
      video: data.video,
    };
    if (chapter === null) {
      dispatch(
        addChapter({
          chapter: newChapter,
          sectionIndex: selectedSectionIndex as number,
        })
      );
    } else {
      editChapter({
        chapter: newChapter,
        chapterIndex: selectedChapterIndex as number,
        sectionIndex: selectedSectionIndex as number,
      });
    }
    toast.success(
      `Chapter added/updated successfully but you need to save the course to apply the changes`
    );
    closeModel();
  };

  return (
    <CustomModal isOpen={isChapterModalOpen} onClose={closeModel} key={1}>
      <div className="chapter-modal">
        <div className="chapter-modal__header">
          <h2 className="chapter-modal__title">Add/Edit Chapter</h2>
          <button onClick={closeModel} className="chapter-modal__close">
            <X className="w-6 h-6" />
          </button>
        </div>
        <Form {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="chapter-modal__form"
          >
            <CustomFormField
              name="title"
              label="Chapter Title"
              placeholder="Write chapter title here"
            />

            <CustomFormField
              name="content"
              label="Chapter Content"
              type="textarea"
              placeholder="Write chapter content here"
            />

            <FormField
              control={methods.control}
              name="video"
              render={({ field: { onChange, value } }) => (
                <FormItem>
                  <FormLabel className="text-customgreys-dirtyGrey text-sm">
                    Chapter Video
                  </FormLabel>
                  <FormControl>
                    <div>
                      <Input
                        type="file"
                        accept="video/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            onChange(file);
                          }
                        }}
                        className="border-none bg-customgreys-darkGrey py-2 cursor-pointer"
                      />
                      {typeof value === 'string' && value && (
                        <div className="my-2 text-sm text-gray-600">
                          Current video: {value.split('/').pop()}
                        </div>
                      )}
                      {value instanceof File && (
                        <div className="my-2 text-sm text-gray-600">
                          Selected file: {value.name}
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <div className="chapter-modal__actions">
              <Button type="button" variant="outline" onClick={closeModel}>
                Cancel
              </Button>
              <Button type="submit" className="bg-primary-700">
                Save
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </CustomModal>
  );
};

export default ChapterModel;
