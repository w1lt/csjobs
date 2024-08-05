import React from "react";
import {
  Popover,
  Indicator,
  Button,
  Stack,
  Select,
  TextInput,
  Chip,
  Checkbox,
} from "@mantine/core";
import { IconChevronDown, IconChevronUp, IconX } from "@tabler/icons-react";

const FilterPopover = ({
  label,
  placeholder,
  data,
  value,
  onChange,
  applied,
  removeSelected,
  inputType,
  inputValue,
  onInputChange,
  isOpen,
  onOpen,
  onClose,
  icon: Icon,
  mostOccurringOptions = [],
}) => {
  const isArrayValue = Array.isArray(value);
  const selectedCount = isArrayValue ? value.length : value ? 1 : 0;

  const handleCheckboxChange = (option) => {
    const newValue = isArrayValue
      ? value.includes(option)
        ? value.filter((v) => v !== option)
        : [...value, option]
      : option;
    onChange(newValue);
  };

  return (
    <Popover position="bottom-end" withArrow closeOnClickOutside={true}>
      <Indicator label={selectedCount} size={16} disabled={!applied} zIndex={4}>
        <Popover.Target>
          <Button
            variant={applied ? "filled" : "light"}
            leftSection={Icon && <Icon size={18} />}
            rightSection={
              isOpen ? (
                <IconChevronUp size={18} />
              ) : (
                <IconChevronDown size={18} />
              )
            }
            onClick={isOpen ? onClose : onOpen}
          >
            {label}
          </Button>
        </Popover.Target>
      </Indicator>
      <Popover.Dropdown>
        {inputType === "select" ? (
          <>
            <Select
              label={label}
              placeholder={placeholder}
              searchable
              data={data}
              value={value}
              onChange={onChange}
            />
            <Stack mt="xs">
              {mostOccurringOptions.map((option) => (
                <Checkbox
                  key={option}
                  label={option}
                  checked={value.includes(option)}
                  onChange={() => handleCheckboxChange(option)}
                />
              ))}
            </Stack>
          </>
        ) : (
          <TextInput
            type={inputType}
            label={label}
            value={inputValue}
            onChange={onInputChange}
            leftSection={"$"}
          />
        )}
        {isArrayValue && value.length > 0 && (
          <Stack mt="xs">
            {value.map((filter, index) => (
              <Chip
                checked={true}
                defaultChecked
                key={index}
                onClick={() => removeSelected(filter)}
                icon={<IconX size={18} />}
              >
                {filter}
              </Chip>
            ))}
          </Stack>
        )}
      </Popover.Dropdown>
    </Popover>
  );
};

export default FilterPopover;
