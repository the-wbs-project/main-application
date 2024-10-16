
ALTER TABLE [dbo].[LibraryEntryVersions] DROP CONSTRAINT [LibraryEntryVersions_EntryId]
GO

ALTER TABLE [dbo].[WatchersLibraryEntries] DROP CONSTRAINT [LibraryEntryWatchers_EntryId]
GO

SELECT *
INTO #LibraryEntries
FROM [dbo].[LibraryEntries]
GO

DROP TABLE [dbo].[LibraryEntries]
GO

CREATE TABLE [dbo].[LibraryEntries]
(
    [Id] nvarchar(100) NOT NULL,
    [RecordId] nvarchar(100) NOT NULL,
    [OwnerId] nvarchar(100) NOT NULL,
    [PublishedVersion] int NULL,
    [Type] nvarchar(50) NOT NULL,
    [Visibility] nvarchar(50) NOT NULL,
    CONSTRAINT [LibraryEntries_PK] PRIMARY KEY CLUSTERED ([Id] ASC),
    INDEX [LibraryEntries_INDX_OwnerId] NONCLUSTERED ([OwnerId] ASC)
)
GO

DECLARE @Min INT = 10000
DECLARE @Max INT = 999999

INSERT INTO [dbo].[LibraryEntries]
    ([Id], [RecordId], [OwnerId], [PublishedVersion], [Type], [Visibility])
SELECT [Id], 'L-' + RIGHT('0000' + CAST(FLOOR(RAND() * (@Max - @Min) + @Min) AS VARCHAR(10)), 6), [OwnerId], [PublishedVersion], [Type], [Visibility]
FROM #LibraryEntries
GO

DROP TABLE #LibraryEntries
GO


ALTER TABLE [dbo].[LibraryEntryVersions] ADD CONSTRAINT [LibraryEntryVersions_EntryId] FOREIGN KEY ([EntryId]) REFERENCES [dbo].[LibraryEntries] ([Id]) ON DELETE CASCADE
GO

ALTER TABLE [dbo].[WatchersLibraryEntries] ADD CONSTRAINT [LibraryEntryWatchers_EntryId] FOREIGN KEY ([EntryId]) REFERENCES [dbo].[LibraryEntries] ([Id]) ON DELETE CASCADE
GO
