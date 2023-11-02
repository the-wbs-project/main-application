DROP TABLE dbo.ChatComment
GO

CREATE TABLE [dbo].[ChatComment] (
    [ThreadId] nvarchar(100) NOT NULL,
    [Timestamp] datetimeoffset NOT NULL,
    [Author] nvarchar(100) NOT NULL,
    [Text] nvarchar(MAX) NULL,
    INDEX ChatComment_INDX_ThreadId NONCLUSTERED (ThreadId ASC, Timestamp DESC),
)