SELECT COUNT(*)
FROM [dbo].[LibraryEntries]
WHERE RecordId = 'L-940578'

DECLARE @Id VARCHAR(10)
EXEC [dbo].[LibraryEntry_GetNewId] @Id OUTPUT

UPDATE [dbo].[LibraryEntries]
SET RecordId = @Id
WHERE Id IN (SELECT TOP 1
    Id
FROM [dbo].[LibraryEntries]
WHERE RecordId = 'L-940578')


EXEC [dbo].[LibraryEntry_GetNewId] @Id OUTPUT

UPDATE [dbo].[LibraryEntries]
SET RecordId = @Id
WHERE Id IN (SELECT TOP 1
    Id
FROM [dbo].[LibraryEntries]
WHERE RecordId = 'L-940578')


EXEC [dbo].[LibraryEntry_GetNewId] @Id OUTPUT

UPDATE [dbo].[LibraryEntries]
SET RecordId = @Id
WHERE Id IN (SELECT TOP 1
    Id
FROM [dbo].[LibraryEntries]
WHERE RecordId = 'L-940578')


EXEC [dbo].[LibraryEntry_GetNewId] @Id OUTPUT

UPDATE [dbo].[LibraryEntries]
SET RecordId = @Id
WHERE Id IN (SELECT TOP 1
    Id
FROM [dbo].[LibraryEntries]
WHERE RecordId = 'L-940578')

EXEC [dbo].[LibraryEntry_GetNewId] @Id OUTPUT

UPDATE [dbo].[LibraryEntries]
SET RecordId = @Id
WHERE Id IN (SELECT TOP 1
    Id
FROM [dbo].[LibraryEntries]
WHERE RecordId = 'L-940578')

EXEC [dbo].[LibraryEntry_GetNewId] @Id OUTPUT

UPDATE [dbo].[LibraryEntries]
SET RecordId = @Id
WHERE Id IN (SELECT TOP 1
    Id
FROM [dbo].[LibraryEntries]
WHERE RecordId = 'L-940578')

EXEC [dbo].[LibraryEntry_GetNewId] @Id OUTPUT

UPDATE [dbo].[LibraryEntries]
SET RecordId = @Id
WHERE Id IN (SELECT TOP 1
    Id
FROM [dbo].[LibraryEntries]
WHERE RecordId = 'L-940578')

EXEC [dbo].[LibraryEntry_GetNewId] @Id OUTPUT

UPDATE [dbo].[LibraryEntries]
SET RecordId = @Id
WHERE Id IN (SELECT TOP 1
    Id
FROM [dbo].[LibraryEntries]
WHERE RecordId = 'L-940578')

EXEC [dbo].[LibraryEntry_GetNewId] @Id OUTPUT

UPDATE [dbo].[LibraryEntries]
SET RecordId = @Id
WHERE Id IN (SELECT TOP 1
    Id
FROM [dbo].[LibraryEntries]
WHERE RecordId = 'L-940578')

EXEC [dbo].[LibraryEntry_GetNewId] @Id OUTPUT

UPDATE [dbo].[LibraryEntries]
SET RecordId = @Id
WHERE Id IN (SELECT TOP 1
    Id
FROM [dbo].[LibraryEntries]
WHERE RecordId = 'L-940578')
