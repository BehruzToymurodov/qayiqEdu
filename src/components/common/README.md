# Reusable Components

This directory contains reusable components that can be used throughout the application.

## DataTable Component

A flexible table component for displaying data with customizable columns and actions.

### Usage

```jsx
import DataTable from '../components/common/DataTable'

const columns = [
  {
    key: 'id',
    title: 'ID',
    width: '60px'
  },
  {
    key: 'name',
    title: 'Name'
  },
  {
    key: 'actions',
    title: 'Actions',
    render: (item) => (
      <div className='flex space-x-2'>
        <button onClick={() => editItem(item)}>Edit</button>
        <button onClick={() => deleteItem(item.id)}>Delete</button>
      </div>
    )
  }
]

const data = [
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' }
]

<DataTable
  columns={columns}
  data={data}
  loading={false}
  onRowClick={(item) => console.log('Row clicked:', item)}
/>
```

### Props

- `columns` (array): Column definitions
- `data` (array): Data to display
- `loading` (boolean): Show loading state
- `onRowClick` (function): Called when row is clicked
- `emptyState` (component): Custom empty state component

### Column Definition

```jsx
{
  key: 'fieldName',        // Field name in data object
  title: 'Column Title',   // Column header text
  width: '100px',          // Optional column width
  icon: true,              // Show info icon next to title
  render: (item, index) => ReactNode, // Custom render function
  onClick: (item, index) => void      // Click handler for column
}
```

## Form Component

A flexible form component with various field types and validation.

### Usage

```jsx
import Form from '../components/common/Form'

const fields = [
  {
    name: 'username',
    type: 'text',
    label: 'Username',
    value: formData.username,
    onChange: (e) => setFormData({ ...formData, username: e.target.value }),
    required: true,
    placeholder: 'Enter username'
  },
  {
    name: 'role',
    type: 'select',
    label: 'Role',
    value: formData.role,
    onChange: (e) => setFormData({ ...formData, role: e.target.value }),
    options: [
      { value: 'admin', label: 'Admin' },
      { value: 'user', label: 'User' }
    ]
  }
]

<Form
  fields={fields}
  onSubmit={handleSubmit}
  onCancel={handleCancel}
  submitText='Save'
  cancelText='Cancel'
  submitButtonColor='green'
  cancelButtonColor='blue-outline'
  loading={false}
/>
```

### Props

- `fields` (array): Form field definitions
- `onSubmit` (function): Form submission handler
- `onCancel` (function): Cancel button handler
- `submitText` (string): Submit button text
- `cancelText` (string): Cancel button text
- `submitButtonColor` (string): Submit button color
- `cancelButtonColor` (string): Cancel button color
- `loading` (boolean): Show loading state

### Field Types

- `text`: Text input
- `email`: Email input
- `password`: Password input
- `number`: Number input
- `textarea`: Textarea
- `select`: Dropdown select
- `checkbox`: Checkbox
- `radio`: Radio buttons

### Field Definition

```jsx
{
  name: 'fieldName',       // Field name
  type: 'text',            // Field type
  label: 'Field Label',    // Field label
  value: 'value',          // Field value
  onChange: (e) => void,   // Change handler
  placeholder: 'Placeholder',
  required: true,          // Required field
  disabled: false,         // Disabled field
  helperText: 'Help text', // Helper text below field
  error: 'Error message',  // Error message
  options: [               // Options for select/radio
    { value: 'val', label: 'Label' }
  ]
}
```

### Button Colors

- `blue`: Blue button
- `green`: Green button
- `red`: Red button
- `gray`: Gray button
- `blue-outline`: Blue outline button
- `green-outline`: Green outline button
- `red-outline`: Red outline button

## Examples

### Olympics Table

```jsx
const olympicsColumns = [
	{
		key: 'index',
		title: '№',
		width: '60px',
		render: (item, index) => index + 1,
	},
	{
		key: 'contextName',
		title: 'Olimpiada nomlari',
	},
	{
		key: 'actions',
		title: 'Amallar',
		icon: true,
		render: item => (
			<div className='flex space-x-2'>
				<button onClick={() => editOlympic(item)}>
					<Edit2 className='h-4 w-4' />
				</button>
				<button onClick={() => deleteOlympic(item.id)}>
					<Trash2 className='h-4 w-4' />
				</button>
			</div>
		),
	},
]
```

### Section Form

```jsx
const sectionFormFields = [
	{
		name: 'name',
		type: 'text',
		label: 'Nomi',
		value: formData.name,
		onChange: e => setFormData({ ...formData, name: e.target.value }),
		placeholder: "Bo'linish belgi",
		required: true,
		helperText: '15/18 belgi',
	},
	{
		name: 'ballType',
		type: 'select',
		label: 'Ball tipi',
		value: formData.ballType,
		onChange: e => setFormData({ ...formData, ballType: e.target.value }),
		options: [
			{ value: 'Har xil', label: 'Har xil' },
			{ value: 'Bir xil', label: 'Bir xil' },
		],
	},
]
```
