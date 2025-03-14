import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Edit } from 'lucide-react';
import { Switch } from './ui/switch';
import { registerPlugin } from 'filepond';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import { FilePond } from 'react-filepond';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface FormFieldProps {
  name: string;
  label: string;
  type?:
    | 'text'
    | 'email'
    | 'textarea'
    | 'number'
    | 'select'
    | 'switch'
    | 'password'
    | 'file'
    | 'multi-input';
  placeholder?: string;
  options?: { value: string; label: string }[];
  accept?: string;
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  value?: string;
  disabled?: boolean;
  multiple?: boolean;
  isIcon?: boolean;
  initialValue?: string | number | boolean | string[];
}
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);
const FormComponent: React.FC<FormFieldProps> = ({
  name,
  label,
  type = 'text',
  placeholder,
  options,
  accept,
  className,
  inputClassName,
  labelClassName,
  disabled = false,
  multiple = false,
  isIcon = false,
  initialValue,
}) => {
  const { control } = useFormContext();
  const renderFormControl = (field: any) => {
    switch (type) {
      case 'textarea':
        return (
          <Textarea
            placeholder={placeholder}
            {...field}
            rows={3}
            className={`border-none bg-customgreys-darkGrey p-4 ${inputClassName}`}
          />
        );
      case 'switch':
        return (
          <div className="flex items-center space-x-2">
            <Switch
              {...field}
              id={name}
              onCheckedChange={(checked) => field.onChange(checked)}
              className={`text-customgreys-dirtyGrey ${inputClassName}`}
            />
            <FormLabel htmlFor={name} className={labelClassName}>
              {label}
            </FormLabel>
          </div>
        );
      case 'file':
        const ACCEPTED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg'];
        const acceptedFileTypes = accept ? [accept] : ACCEPTED_VIDEO_TYPES;

        return (
          <FilePond
            className={`${inputClassName}`}
            files={field.value ? [field.value] : []}
            allowMultiple={multiple}
            onupdatefiles={(fileItems) => {
              field.onChange(
                multiple ? fileItems.map((fileItem) => fileItem.file) : fileItems[0]?.file,
              );
            }}
            acceptedFileTypes={acceptedFileTypes}
            labelIdle={`Drag & Drop your files or <span class="filepond--label-action">Browse</span>`}
            credits={false}
          />
        );
      case 'number':
        return (
          <Input
            type="number"
            placeholder={placeholder}
            {...field}
            className={`border-none bg-customgreys-darkGrey p-4 ${inputClassName}`}
            disabled={disabled}
          />
        );
      case 'select':
        return (
          <Select onValueChange={(value) => field.onChange(value)} {...field}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                <SelectLabel>Fruits</SelectLabel>
                {options?.map((option) => {
                  return (
                    <SelectItem key={Math.random()} value={option.value}>
                      {option.label}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
        );
      default:
        return (
          <Input
            type={type}
            placeholder={placeholder}
            {...field}
            className={`border-none bg-customgreys-primarybg p-4 ${inputClassName}`}
            disabled={disabled}
          />
        );
    }
  };
  return (
    <FormField
      control={control}
      name={name}
      defaultValue={initialValue}
      render={({ field }) => (
        <FormItem className={`${type !== 'switch' && 'rounded-md'} relative ${className}`}>
          {type !== 'switch' && (
            <div className="flex justify-between items-center">
              <FormLabel className={`text-customgreys-dirtyGrey text-sm ${labelClassName}`}>
                {label}
              </FormLabel>

              {!disabled && isIcon && type !== 'file' && type !== 'multi-input' && (
                <Edit className="size-4 text-customgreys-dirtyGrey" />
              )}
            </div>
          )}
          <FormControl>
            {renderFormControl({
              ...field,
              value: field.value !== undefined ? field.value : initialValue,
            })}
          </FormControl>
          <FormMessage className="text-red-400" />
        </FormItem>
      )}
    />
  );
};

export default FormComponent;
