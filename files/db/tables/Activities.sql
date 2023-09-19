DROP TABLE dbo.Activities
GO

CREATE TABLE [dbo].[Activities] (
    [Id] nvarchar(100) NOT NULL,
    [Action] nvarchar(200) NOT NULL,
    [Timestamp] datetimeoffset NOT NULL,
    [UserId] nvarchar(100) NOT NULL,
    [TopLevelId] nvarchar(100) NOT NULL,
    [ObjectId] nvarchar(100) NULL,
    [VersionId] nvarchar(100) NULL,
    [Data] nvarchar(MAX) NULL,
    CONSTRAINT Activities_PK PRIMARY KEY CLUSTERED (Id ASC),
    INDEX Activities_INDX_ID NONCLUSTERED (TopLevelId ASC, ObjectId ASC),
    INDEX Activities_INDX_UserId NONCLUSTERED (UserId ASC)
)